// frontend/src/components/FeaturedProducts.jsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const FeaturedProducts = ({ featuredProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    // 📌 Responsive: Điều chỉnh số sản phẩm hiển thị theo màn hình
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1);      // Mobile: 1 sản phẩm
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);      // Tablet: 2 sản phẩm
            } else if (window.innerWidth < 1280) {
                setItemsPerPage(3);      // Desktop nhỏ: 3 sản phẩm
            } else {
                setItemsPerPage(4);      // Desktop lớn: 4 sản phẩm
            }
        };

        handleResize();  // Gọi lần đầu
        window.addEventListener("resize", handleResize);
        
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 📌 Nút Previous
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 
                ? featuredProducts.length - itemsPerPage 
                : prevIndex - 1
        );
    };

    // 📌 Nút Next
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === featuredProducts.length - itemsPerPage 
                ? 0 
                : prevIndex + 1
        );
    };

    // 📌 Kiểm tra có đủ sản phẩm để hiển thị carousel không
    const canSlide = featuredProducts.length > itemsPerPage;

    return (
        <div className='py-12'>
            {/* Header */}
            <div className='container mx-auto px-4'>
                <h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
                    Featured Products
                </h2>

                {/* Carousel Container */}
                <div className='relative'>
                    {/* Products Grid */}
                    <div className='overflow-hidden'>
                        <div
                            className='flex transition-transform duration-300 ease-in-out'
                            style={{ 
                                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` 
                            }}
                        >
                            {featuredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {canSlide && (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={prevSlide}
                                className='absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={nextSlide}
                                className='absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;