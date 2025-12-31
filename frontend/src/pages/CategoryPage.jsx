// frontend/src/pages/CategoryPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
    const { category } = useParams();  // Lấy category từ URL
    const { products, loading, fetchProductsByCategory } = useProductStore();

    // 📌 Fetch products theo category khi vào trang hoặc đổi category
    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Header */}
                <h1 className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </h1>

                {/* No Products Found */}
                {(!products || products.length === 0) && (
                    <div className='flex flex-col items-center justify-center py-16'>
                        <p className='text-xl text-gray-400'>
                            No products found in this category
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;