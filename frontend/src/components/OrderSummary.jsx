// frontend/src/components/OrderSummary.jsx
import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
    "pk_test_51SB2hRGlJgVQJxU5iTFPBtqTrryApXWIRxSkx89FUfMxil7se4PU8SmlQGAqXt2u1VFJDk2YgF5rWFVcrWQ8MKVu00LpBVsln9"
);

const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, applyCoupon, removeCoupon, cart } = useCartStore();
    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Tính savings (số tiền được giảm)
    const savings = subtotal < total ? total - subtotal : 0;

    // 📌 Xử lý checkout với Stripe
    const handlePayment = async () => {
        if (!cart || cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsLoading(true);
        try {
            // 🔴 BACKEND: POST /api/payments/create-checkout-session
            const res = await axios.post("/payments/create-checkout-session", {
                products: cart,
                couponCode: coupon ? coupon.code : null,
            });

            const { url } = res.data;
            
            if (url) {
                // Redirect trực tiếp đến Stripe Checkout
                window.location.href = url;
            } else {
                throw new Error("No checkout URL received");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Error processing payment";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    // 📌 Xử lý apply coupon
    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        await applyCoupon(couponCode);
        setCouponCode("");
    };

    // 📌 Xử lý remove coupon
    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode("");
    };

    return (
        <div className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'>
            <p className='text-xl font-semibold text-emerald-400'>Order summary</p>

            <div className='space-y-4'>
                <div className='space-y-2'>
                    {/* Subtotal */}
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300'>Original price</dt>
                        <dd className='text-base font-medium text-white'>${total.toFixed(2)}</dd>
                    </dl>

                    {/* Savings (nếu có coupon) */}
                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Savings</dt>
                            <dd className='text-base font-medium text-emerald-400'>
                                -${savings.toFixed(2)}
                            </dd>
                        </dl>
                    )}

                    {/* Coupon Applied */}
                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>
                                Coupon ({coupon.code})
                            </dt>
                            <dd className='text-base font-medium text-emerald-400'>
                                -{coupon.discountPercentage}%
                            </dd>
                        </dl>
                    )}

                    {/* Divider */}
                    <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
                        <dt className='text-base font-bold text-white'>Total</dt>
                        <dd className='text-base font-bold text-emerald-400'>
                            ${subtotal.toFixed(2)}
                        </dd>
                    </dl>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50'
                >
                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                </button>

                {/* Coupon Input */}
                <div className='flex items-center gap-2'>
                    <input
                        type='text'
                        placeholder='Enter coupon code'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className='flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                    <button
                        onClick={handleApplyCoupon}
                        className='rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700'
                    >
                        Apply
                    </button>
                </div>

                {/* Remove Coupon Button */}
                {coupon && isCouponApplied && (
                    <button
                        onClick={handleRemoveCoupon}
                        className='w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-red-400 hover:bg-gray-600'
                    >
                        Remove Coupon
                    </button>
                )}

                {/* Continue Shopping Link */}
                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>or</span>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;