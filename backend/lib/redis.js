import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect",() => {
    console.log("Redis connected");
});

redisClient.on("error",(err) => {
    console.log("Redis error", err);
});
//cache

export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log(`Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`Cache MISS: ${key}`);
        return null;
    } catch (error) {
        console.error("Redis getCache error:", error);
        return null; 
    }
};

export const setCache = async (key, data, ttl = 300) => {
    try {
        await redisClient.setex(key, ttl, JSON.stringify(data));
        console.log(`Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
        console.error("Redis setCache error:", error);
    }
};

export const invalidateCache = async (pattern) => {
    try { 
        if (pattern.includes("*")) {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
                console.log(`Cache INVALIDATED: ${keys.length} keys matching "${pattern}"`);
            }
        } else {
            await redisClient.del(pattern);
            console.log(`Cache INVALIDATED: ${pattern}`);
        }
    } catch (error) {
        console.error("Redis invalidateCache error:", error);
    }
};

//  CACHE KEYS 
export const CACHE_KEYS = {
    FEATURED_PRODUCTS: "products:featured",
    CATEGORY: (category) => `products:category:${category}`,
    PRODUCT: (id) => `products:${id}`,
    ALL_PRODUCTS: "products:all",
};
// CACHE TTL 
export const CACHE_TTL = {
    FEATURED: 300,     
    CATEGORY: 300,      
    PRODUCT: 600,      
    ALL_PRODUCTS: 60,   
};