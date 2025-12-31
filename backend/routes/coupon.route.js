
import express from "express";
import { getCoupon, validateCoupon, seedCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/seed", protectRoute, seedCoupon); // Tạo coupon test

export default router;