import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./lib/db.js";
import { redisClient } from "./lib/redis.js";
import { metricsMiddleware, metricsEndpoint } from "./lib/metrics.js";
import { generalLimiter, authLimiter } from "./lib/rateLimiter.js";
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

// Đo thời gian mọi request prometheus
app.use(metricsMiddleware);  // Đo thời gian mọi request
app.get("/metrics", metricsEndpoint);  // Endpoint để Prometheus scrape

// HEALTH CHECK ENDPOINTS 

//Service có đang chạy không?
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// Service đã sẵn sàng nhận traffic chưa?
app.get("/health/ready", async (req, res) => {
    try {
        const healthStatus = {
            status: "ok",
            timestamp: new Date().toISOString(),
            services: {}
        };

        // Check MongoDB
        if (mongoose.connection.readyState === 1) {
            healthStatus.services.mongodb = { status: "connected" };
        } else {
            healthStatus.services.mongodb = { status: "disconnected" };
            healthStatus.status = "degraded";
        }

        // Check Redis
        try {
            await redisClient.ping();
            healthStatus.services.redis = { status: "connected" };
        } catch (err) {
            healthStatus.services.redis = { status: "disconnected", error: err.message };
            healthStatus.status = "degraded";
        }

        const statusCode = healthStatus.status === "ok" ? 200 : 503;
        res.status(statusCode).json(healthStatus);
    } catch (error) {
        res.status(503).json({ 
            status: "error", 
            error: error.message 
        });
    }
});

// RATE LIMITING

// Auth routes
app.use("/api/auth", authLimiter, authRouters);

// general limit
app.use("/api/products", generalLimiter, productRoutes);
app.use("/api/cart", generalLimiter, cartRoutes);
app.use("/api/coupons", generalLimiter, couponRoutes);
app.use("/api/payments", generalLimiter, paymentRoutes); 
app.use("/api/analytics", generalLimiter, analyticsRoutes); 

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// GRACEFUL SHUTDOWN

const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    //Ngưng nhận requests mới
    server.close(() => {
        console.log("HTTP server closed");
    });

    try {
        //Đóng MongoDB connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed");

        //Đóng Redis connection
        await redisClient.quit();
        console.log("Redis connection closed");

        console.log("Graceful shutdown completed");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};

// Lắng nghe signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Docker/K8s stop
process.on("SIGINT", () => gracefulShutdown("SIGINT"));   // Ctrl+C