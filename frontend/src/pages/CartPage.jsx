// frontend/src/pages/CartPage.jsx
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import PeopleAlsoBought from "../components/PeopleAlsoBought";

const CartPage = () => {
    const { cart, getCartItems } = useCartStore();

    // 📌 Fetch giỏ hàng khi vào trang
    useEffect(() => {
        getCartItems();
    }, [getCartItems]);

    return (
        <div className='py-8 md:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                {/* Header */}
                <div className='mb-6 flex items-center gap-2'>
                    <ShoppingCart className='h-8 w-8 text-emerald-400' />
                    <h1 className='text-3xl font-bold text-white'>
                        Shopping Cart
                    </h1>
                </div>

                {/* Empty Cart */}
                {cart.length === 0 ? (
                    <div className='flex flex-col items-center justify-center space-y-4 py-16'>
                        <ShoppingCart className='h-24 w-24 text-gray-400' />
                        <h3 className='text-2xl font-semibold text-white'>
                            Your cart is empty
                        </h3>
                        <p className='text-gray-400'>
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link
                            className='mt-4 rounded-md bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700'
                            to='/'
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
                        {/* LEFT SIDE: Cart Items */}
                        <div className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'>
                            <div className='space-y-6'>
                                {cart.map((item) => (
                                    <CartItem key={item._id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE: Order Summary */}
                        <div className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'>
                            <OrderSummary />
                            <PeopleAlsoBought />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;