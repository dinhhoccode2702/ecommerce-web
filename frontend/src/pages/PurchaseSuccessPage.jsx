// frontend/src/pages/PurchaseSuccessPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, HandHeart, ArrowRight } from "lucide-react";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const { clearCart } = useCartStore();

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId) => {
            try {
                // 🔴 BACKEND: POST /api/payments/checkout-success
                const response = await axios.post("/payments/checkout-success", {
                    sessionId,
                });
                
                setOrderDetails(response.data);
                clearCart();
            } catch (error) {
                console.error("Error processing successful checkout:", error);
            } finally {
                setIsProcessing(false);
            }
        };

        // Lấy sessionId từ URL query params
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
        }
    }, [clearCart]);

    if (isProcessing) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-white text-xl'>Processing your order...</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={500}
                gravity={0.1}
            />

            <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
                <div className='p-6 sm:p-8'>
                    {/* Success Icon */}
                    <div className='flex justify-center'>
                        <CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
                    </div>

                    {/* Header */}
                    <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
                        Purchase Successful!
                    </h1>
                    
                    <p className='text-gray-300 text-center mb-6'>
                        Thank you for your order. We're processing it now.
                    </p>

                    {/* Order Details */}
                    {orderDetails && (
                        <div className='bg-gray-700 rounded-lg p-4 mb-6'>
                            <div className='flex justify-between items-center mb-2'>
                                <span className='text-sm text-gray-400'>Order number</span>
                                <span className='text-sm font-semibold text-emerald-400'>
                                    #{orderDetails.orderNumber || orderDetails._id.slice(-6)}
                                </span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-400'>Estimated delivery</span>
                                <span className='text-sm font-semibold text-emerald-400'>
                                    3-5 business days
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Gift Coupon Message */}
                    <div className='bg-emerald-800 border border-emerald-700 rounded-lg p-4 mb-6'>
                        <div className='flex items-center gap-3'>
                            <HandHeart className='text-emerald-400 w-8 h-8 flex-shrink-0' />
                            <div>
                                <h3 className='text-emerald-400 font-semibold'>
                                    Thank you for your purchase!
                                </h3>
                                <p className='text-emerald-100 text-sm mt-1'>
                                    We've sent a gift coupon code to your email. Use it on your next order!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='space-y-3'>
                        <Link
                            to='/'
                            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
                        >
                            Continue Shopping
                            <ArrowRight className='ml-2 w-5 h-5' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;