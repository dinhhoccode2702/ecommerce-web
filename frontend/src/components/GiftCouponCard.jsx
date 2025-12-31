import { useEffect, useState } from "react";

const GiftCouponCard = () => {
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock coupon for UI testing
        setTimeout(() => {
            setCoupon({
                code: "GIFT20",
                discountPercentage: 20,
                expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            });
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <div className='bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse'>
                <div className='h-4 bg-gray-700 rounded w-3/4 mb-2'></div>
                <div className='h-8 bg-gray-700 rounded w-1/2'></div>
            </div>
        );
    }

    if (!coupon) {
        return null;
    }

    return (
        <div className='bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-lg p-4 shadow-lg'>
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
        </div>
    );
};

export default GiftCouponCard;
