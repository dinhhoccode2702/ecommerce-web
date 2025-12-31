import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Calendar, PercentIcon, CheckCircle, XCircle } from "lucide-react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const CouponsPage = () => {
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupon();
    }, []);

    const fetchCoupon = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/coupons");
            setCoupon(res.data);
        } catch (error) {
            console.error("Error fetching coupon:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const isExpired = (dateString) => {
        return new Date(dateString) < new Date();
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied to clipboard!");
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-900'>
                <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='flex flex-col items-center justify-center'
                    >
                        <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500'></div>
                        <p className='mt-4 text-gray-300'>Loading your coupons...</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-900'>
            <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Header */}
                    <div className='mb-8 text-center'>
                        <h1 className='text-4xl font-bold text-white sm:text-5xl'>My Coupons</h1>
                        <p className='mt-2 text-lg text-gray-300'>
                            Your available discount coupons
                        </p>
                    </div>

                    {/* Coupon Card */}
                    {!coupon || !coupon.isActive ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className='mx-auto max-w-2xl rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center'
                        >
                            <Ticket className='mx-auto mb-4 h-20 w-20 text-gray-500' />
                            <h2 className='mb-2 text-2xl font-semibold text-gray-300'>
                                No Active Coupons
                            </h2>
                            <p className='text-gray-400'>
                                You don't have any active coupons right now. Make a purchase over $200 to
                                earn a new coupon!
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className='mx-auto max-w-2xl'
                        >
                            <div
                                className={`relative overflow-hidden rounded-2xl border-2 ${
                                    isExpired(coupon.expirationDate)
                                        ? "border-red-500 bg-gradient-to-br from-red-900/20 to-gray-800"
                                        : "border-emerald-500 bg-gradient-to-br from-emerald-900/30 to-gray-800"
                                } p-8 shadow-2xl`}
                            >
                                {/* Background Pattern */}
                                <div className='absolute inset-0 opacity-10'>
                                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.5),rgba(0,0,0,0))]'></div>
                                </div>

                                {/* Content */}
                                <div className='relative z-10'>
                                    {/* Status Badge */}
                                    <div className='mb-4 flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <Ticket className='h-6 w-6 text-emerald-400' />
                                            <span className='text-sm font-medium text-emerald-400'>
                                                Gift Coupon
                                            </span>
                                        </div>
                                        {isExpired(coupon.expirationDate) ? (
                                            <div className='flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1'>
                                                <XCircle className='h-4 w-4 text-red-400' />
                                                <span className='text-sm font-medium text-red-400'>
                                                    Expired
                                                </span>
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1'>
                                                <CheckCircle className='h-4 w-4 text-emerald-400' />
                                                <span className='text-sm font-medium text-emerald-400'>
                                                    Active
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Coupon Code */}
                                    <div className='mb-6 text-center'>
                                        <p className='mb-2 text-sm font-medium text-gray-400'>
                                            Coupon Code
                                        </p>
                                        <div
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className='inline-block cursor-pointer rounded-lg border-2 border-dashed border-emerald-400 bg-gray-900/50 px-6 py-3 transition-all hover:border-emerald-300 hover:bg-gray-900'
                                        >
                                            <p className='text-3xl font-bold tracking-wider text-white'>
                                                {coupon.code}
                                            </p>
                                        </div>
                                        <p className='mt-2 text-xs text-gray-400'>
                                            Click to copy code
                                        </p>
                                    </div>

                                    {/* Discount Amount */}
                                    <div className='mb-6 flex items-center justify-center gap-2'>
                                        <PercentIcon className='h-8 w-8 text-emerald-400' />
                                        <p className='text-4xl font-bold text-emerald-400'>
                                            {coupon.discountPercentage}% OFF
                                        </p>
                                    </div>

                                    {/* Expiration Date */}
                                    <div className='flex items-center justify-center gap-2 text-gray-300'>
                                        <Calendar className='h-5 w-5' />
                                        <p className='text-sm'>
                                            {isExpired(coupon.expirationDate) ? "Expired on" : "Valid until"}{" "}
                                            <span className='font-semibold'>
                                                {formatDate(coupon.expirationDate)}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Terms */}
                                    <div className='mt-6 border-t border-gray-700 pt-6'>
                                        <p className='mb-2 text-center text-sm font-medium text-gray-300'>
                                            Terms & Conditions
                                        </p>
                                        <ul className='space-y-1 text-xs text-gray-400'>
                                            <li>• Valid for one-time use only</li>
                                            <li>• Can be applied to any purchase</li>
                                            <li>• Cannot be combined with other offers</li>
                                            <li>
                                                • Earn new coupons by making purchases over $200
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Decorative Circles */}
                                <div className='absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-900'></div>
                                <div className='absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-gray-900'></div>
                            </div>
                        </motion.div>
                    )}

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='mx-auto mt-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6'
                    >
                        <h3 className='mb-3 text-lg font-semibold text-white'>
                            How to Earn Coupons
                        </h3>
                        <p className='text-sm text-gray-300'>
                            Earn a <span className='font-semibold text-emerald-400'>10% discount coupon</span> every
                            time you make a purchase of $200 or more. The coupon will be valid for 30 days
                            and can be used on your next order.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CouponsPage;
