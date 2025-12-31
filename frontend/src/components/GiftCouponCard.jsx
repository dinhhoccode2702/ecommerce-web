import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Link } from "react-router-dom";

const GiftCouponCard = () => {
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupon();
    }, []);

    const fetchCoupon = async () => {
        try {
            const res = await axios.get("/coupons");
            setCoupon(res.data);
        } catch (error) {
            console.error("Error fetching coupon:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse'>
                <div className='h-4 bg-gray-700 rounded w-3/4 mb-2'></div>
                <div className='h-8 bg-gray-700 rounded w-1/2'></div>
            </div>
        );
    }

    if (!coupon || !coupon.isActive) {
        return null;
    }

    return (
        <Link to='/coupons' className='block'>
            <div className='bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-lg p-4 shadow-lg transition-transform hover:scale-105 cursor-pointer'>
                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-emerald-100 text-sm font-medium'>Your Available Coupon</p>
                        <p className='text-white text-2xl font-bold mt-1'>{coupon.code}</p>
                        <p className='text-emerald-200 text-sm mt-1'>
                            {coupon.discountPercentage}% off your order
                        </p>
                    </div>
                    <div className='text-right'>
                        <p className='text-emerald-200 text-xs'>Expires</p>
                        <p className='text-white text-sm font-medium'>
                            {new Date(coupon.expirationDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <p className='text-emerald-100 text-xs mt-2 text-center'>
                    Click to view details
                </p>
            </div>
        </Link>
    );
};

export default GiftCouponCard;
