import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Lấy dữ liệu analytics tổng quan
export const getAnalyticsData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

        res.json({
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue,
        });
    } catch (error) {
        console.log("Error in getAnalyticsData controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Lấy dữ liệu sales theo ngày
export const getDailySalesData = async (req, res) => {
    try {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArray = getDatesInRange(startDate, endDate);

        const result = dateArray.map((date) => {
            const foundData = dailySalesData.find((item) => item._id === date);

            return {
                date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });

        res.json(result);
    } catch (error) {
        console.log("Error in getDailySalesData controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Helper function: Tạo mảng dates trong range
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}