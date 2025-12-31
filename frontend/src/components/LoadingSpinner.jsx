import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden'>
            {/* Background gradient */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute inset-0'>
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
                </div>
            </div>

            <motion.div
                className='w-16 h-16 border-4 border-t-4 border-t-emerald-500 border-emerald-200 rounded-full'
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default LoadingSpinner;
