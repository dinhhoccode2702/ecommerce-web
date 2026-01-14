import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "./redis.js";

// RATE LIMITING 

const createRateLimiter = (options) => {
    const {
        windowMs = 60 * 1000,  // 1 phút default
        max = 100,              // 100 requests/phút default
        message = "Too many requests, please try again later",
        keyPrefix = "rl:"
    } = options;

    return rateLimit({
        windowMs,
        max,
        message: { 
            status: 429,
            error: "Too Many Requests",
            message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,  // Return rate limit 
        legacyHeaders: false,
        
        // Sử dụng Redis để lưu count
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix: keyPrefix,
        }),
        
        // Handler khi bị rate limit
        handler: (req, res, next, options) => {
            console.log(`Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json(options.message);
        },
        
        // Tắt validation cho IPv6 warning
        validate: { xForwardedForHeader: false }
    });
};

export const generalLimiter = createRateLimiter({
    windowMs: 60 * 1000,      
    max: 100,                 
    message: "Too many requests, please try again after 1 minute",
    keyPrefix: "rl:general:"
});
 
export const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, 
    max: 10,                  
    message: "Too many login attempts, please try again after 15 minutes",
    keyPrefix: "rl:auth:"
});

export const writeLimiter = createRateLimiter({
    windowMs: 60 * 1000,     
    max: 30,                  
    message: "Too many write operations, please slow down",
    keyPrefix: "rl:write:"
});

export const strictLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, 
    max: 5,                   
    message: "Rate limit exceeded for this sensitive operation",
    keyPrefix: "rl:strict:"
});

export default {
    generalLimiter,
    authLimiter,
    writeLimiter,
    strictLimiter,
    createRateLimiter
};
