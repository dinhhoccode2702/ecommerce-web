import Coupon from "../models/coupon.model.js";

// Lấy coupon của user
export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Validate coupon
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ 
            code: code, 
            userId: req.user._id, 
            isActive: true 
        });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Seed coupon cho user (chỉ dùng để test/development)
export const seedCoupon = async (req, res) => {
    try {
        // Xóa coupon cũ của user (nếu có)
        await Coupon.findOneAndDelete({ userId: req.user._id });

        // Tạo coupon mới
        const newCoupon = new Coupon({
            code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
            userId: req.user._id,
            isActive: true,
        });

        await newCoupon.save();

        res.status(201).json({
            message: "Coupon created successfully",
            coupon: newCoupon,
        });
    } catch (error) {
        console.log("Error in seedCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};