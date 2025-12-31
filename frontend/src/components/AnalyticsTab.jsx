// frontend/src/components/AnalyticsTab.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LoadingSpinner from "./LoadingSpinner";

const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [dailySalesData, setDailySalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 📌 Fetch analytics data
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                // 🔴 BACKEND: GET /api/analytics (cần auth + admin)
                const response = await axios.get("/analytics");
                setAnalyticsData(response.data.analyticsData);
                setDailySalesData(response.data.dailySalesData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                {/* Total Users */}
                <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-400 text-sm'>Total Users</p>
                            <h3 className='text-3xl font-bold text-white mt-2'>
                                {analyticsData.users}
                            </h3>
                        </div>
                        <Users className='h-12 w-12 text-emerald-400' />
                    </div>
                </div>

                {/* Total Products */}
                <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-400 text-sm'>Total Products</p>
                            <h3 className='text-3xl font-bold text-white mt-2'>
                                {analyticsData.products}
                            </h3>
                        </div>
                        <Package className='h-12 w-12 text-blue-400' />
                    </div>
                </div>

                {/* Total Sales */}
                <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-400 text-sm'>Total Sales</p>
                            <h3 className='text-3xl font-bold text-white mt-2'>
                                {analyticsData.totalSales}
                            </h3>
                        </div>
                        <ShoppingCart className='h-12 w-12 text-purple-400' />
                    </div>
                </div>

                {/* Total Revenue */}
                <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-400 text-sm'>Total Revenue</p>
                            <h3 className='text-3xl font-bold text-white mt-2'>
                                ${analyticsData.totalRevenue.toFixed(2)}
                            </h3>
                        </div>
                        <DollarSign className='h-12 w-12 text-yellow-400' />
                    </div>
                </div>
            </div>

            {/* Sales Chart */}
            <div className='bg-gray-800 rounded-lg p-6 shadow-lg'>
                <h3 className='text-xl font-semibold text-white mb-6'>
                    Sales Overview
                </h3>
                <div className='h-80'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={dailySalesData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                            <XAxis dataKey='name' stroke='#9CA3AF' />
                            <YAxis stroke='#9CA3AF' />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                                    borderColor: "#4B5563",
                                }}
                                itemStyle={{ color: "#E5E7EB" }}
                            />
                            <Legend />
                            <Line 
                                type='monotone' 
                                dataKey='sales' 
                                stroke='#10B981' 
                                strokeWidth={3}
                                dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                            />
                            <Line 
                                type='monotone' 
                                dataKey='revenue' 
                                stroke='#3B82F6' 
                                strokeWidth={3}
                                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;