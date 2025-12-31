import { Link } from "react-router-dom";

const categories = [
    { href: "/category/jeans", name: "Jeans", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600" },
    { href: "/category/t-shirts", name: "T-shirts", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600" },
    { href: "/category/shoes", name: "Shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
    { href: "/category/glasses", name: "Glasses", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600" },
    { href: "/category/jackets", name: "Jackets", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600" },
    { href: "/category/suits", name: "Suits", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
    { href: "/category/bags", name: "Bags", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600" },
];

const CategoryItem = () => {
    return (
        <div className='py-12'>
            <div className='container mx-auto px-4'>
                <h2 className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-4'>
                    Explore Our Categories
                </h2>
                <p className='text-center text-gray-300 text-lg mb-12'>
                    Discover the latest trends in each category
                </p>

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={category.href}
                            className='relative group overflow-hidden rounded-lg shadow-lg'
                        >
                            <div className='relative h-48 sm:h-64'>
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                                />
                                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 opacity-70' />
                                <div className='absolute inset-0 flex items-end justify-center pb-4'>
                                    <span className='text-white text-xl sm:text-2xl font-bold group-hover:text-emerald-400 transition-colors duration-300'>
                                        {category.name}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryItem;
