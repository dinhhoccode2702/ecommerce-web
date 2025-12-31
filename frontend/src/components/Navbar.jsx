import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const { cart } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const categories = [
        { name: "Jeans", href: "/category/jeans" },
        { name: "T-shirts", href: "/category/t-shirts" },
        { name: "Shoes", href: "/category/shoes" },
        { name: "Glasses", href: "/category/glasses" },
        { name: "Jackets", href: "/category/jackets" },
        { name: "Suits", href: "/category/suits" },
        { name: "Bags", href: "/category/bags" },
    ];

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    {/* Logo */}
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        E-Commerce
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className='md:hidden text-gray-300 hover:text-emerald-400'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex flex-wrap items-center gap-4'>
                        <Link
                            to={"/"}
                            className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                        >
                            Home
                        </Link>

                        {/* Categories Dropdown */}
                        <div className='relative group'>
                            <button className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                                Categories
                            </button>
                            <div className='absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300'>
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={category.href}
                                        className='block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-300'
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                {cart.length > 0 && (
                                    <span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {
                            user && (
                                <Link
                                    to={"/coupons"}
                                    className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
                                >
                                    Coupon
                                </Link>
                            )
                        }
                    
                        {isAdmin && (
                            <Link
                                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button
                                className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                onClick={handleLogout}
                            >
                                <LogOut size={18} />
                                <span className='hidden sm:inline ml-2'>Log Out</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className='md:hidden mt-4 pb-4 border-t border-gray-700 pt-4'>
                        <div className='flex flex-col gap-4'>
                            <Link
                                to={"/"}
                                className='text-gray-300 hover:text-emerald-400 transition duration-300'
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Mobile Categories */}
                            <div className='border-t border-gray-700 pt-2'>
                                <span className='text-gray-500 text-sm'>Categories</span>
                                <div className='flex flex-col gap-2 mt-2 pl-4'>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.name}
                                            to={category.href}
                                            className='text-gray-300 hover:text-emerald-400 transition duration-300'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {user && (
                                <Link
                                    to={"/cart"}
                                    className='text-gray-300 hover:text-emerald-400 transition duration-300 flex items-center'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShoppingCart className='mr-2' size={20} />
                                    Cart ({cart.length})
                                </Link>
                            )}

                            {isAdmin && (
                                <Link
                                    to={"/secret-dashboard"}
                                    className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-md flex items-center w-fit'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Lock className='mr-2' size={18} />
                                    Dashboard
                                </Link>
                            )}

                            <div className='border-t border-gray-700 pt-4 flex flex-col gap-2'>
                                {user ? (
                                    <button
                                        className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center w-fit'
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={18} className='mr-2' />
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to={"/signup"}
                                            className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center w-fit'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <UserPlus className='mr-2' size={18} />
                                            Sign Up
                                        </Link>
                                        <Link
                                            to={"/login"}
                                            className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center w-fit'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LogIn className='mr-2' size={18} />
                                            Login
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;
