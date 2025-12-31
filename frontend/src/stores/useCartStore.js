import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,
    loading: false,

    getMyCoupon: async () => {
        try {
            // 🔴 BACKEND: GET /coupons
            const response = await axios.get("/coupons");
            set({ coupon: response.data });
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    },

    applyCoupon: async (code) => {
        try {
            // 🔴 BACKEND: POST /coupons/validate
            const response = await axios.post("/coupons/validate", { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },

    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
    },

    getCartItems: async () => {
        set({ loading: true });
        try {
            // 🔴 BACKEND: GET /cart
            const res = await axios.get("/cart");
            set({ cart: res.data, loading: false });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [], loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },

    addToCart: async (product) => {
        try {
            // 🔴 BACKEND: POST /cart
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                      )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        try {
            // 🔴 BACKEND: DELETE /cart
            await axios.delete("/cart", { data: { productId } });
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals();
            toast.success("Product removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }

        try {
            // 🔴 BACKEND: PUT /cart/:id
            await axios.put(`/cart/${productId}`, { quantity });
            set((prevState) => ({
                cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
            }));
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let subtotal = total;

        if (coupon) {
            const discount = total * (coupon.discountPercentage / 100);
            subtotal = total - discount;
        }

        set({ subtotal, total });
    },
}));
