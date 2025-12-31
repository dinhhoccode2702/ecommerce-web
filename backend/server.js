import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./lib/db.js";
import authRouters from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";  


dotenv.config();
const app = express();

//kết nối db
connectDB();
//middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json({limit: '50mb'}));
app.use(cookieParser());

app.use("/api/auth", authRouters);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes); 
app.use("/api/analytics", analyticsRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;