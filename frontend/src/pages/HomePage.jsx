import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";

const HomePage = () => {
    const { fetchFeaturedProducts, products, loading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                {/* Hero Section */}
                <div className='text-center mb-16'>
                    <h1 className='text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
                        Welcome to E-Shop
                    </h1>
                    <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
                        Discover amazing products at unbeatable prices. Shop the latest trends 
                        in fashion, electronics, and more.
                    </p>
                </div>
                {/* {loading && (
                    <div className='flex justify-center items-center'>
                        <LoadingSpinner />
                    </div>
                )} */}
                {/* Featured Products */}
                {!loading && products.length > 0 && (
                    <FeaturedProducts featuredProducts={products} />
                )}

                {/* Category Grid */}
                <CategoryItem />
            </div>
        </div>
    );
};

export default HomePage;
