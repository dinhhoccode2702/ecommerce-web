// frontend/src/pages/PurchaseCancelPage.jsx
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PurchaseCancelPage = () => {
    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
                <div className='p-6 sm:p-8'>
                    {/* Cancel Icon */}
                    <div className='flex justify-center'>
                        <XCircle className='text-red-500 w-16 h-16 mb-4' />
                    </div>

                    {/* Header */}
                    <h1 className='text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2'>
                        Purchase Cancelled
                    </h1>
                    
                    <p className='text-gray-300 text-center mb-6'>
                        Your order has been cancelled. No charges have been made.
                    </p>

                    {/* Message Box */}
                    <div className='bg-gray-700 rounded-lg p-4 mb-6'>
                        <p className='text-sm text-gray-400 text-center'>
                            If you encountered any issues during checkout, please don't hesitate to contact our support team.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='space-y-3'>
                        <Link
                            to='/'
                            className='w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
                        >
                            <ArrowLeft className='mr-2 w-5 h-5' />
                            Back to Shop
                        </Link>
                        
                        <Link
                            to='/cart'
                            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'
                        >
                            Return to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCancelPage;