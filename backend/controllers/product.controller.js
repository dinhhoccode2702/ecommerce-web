import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import { getCache, setCache, invalidateCache, CACHE_KEYS, CACHE_TTL } from "../lib/redis.js";

export const getAllProducts = async (req, res) => {
    try {
        const cached = await getCache(CACHE_KEYS.ALL_PRODUCTS);
        if (cached) {
            return res.status(200).json({ products: cached, fromCache: true });
        }

        const products = await Product.find({}).lean();
  
        await setCache(CACHE_KEYS.ALL_PRODUCTS, products, CACHE_TTL.ALL_PRODUCTS);
        
        res.status(200).json({ products });
    } catch (error) {   
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }   
}

export const getFeaturedProducts = async (req, res) => {
    try {
        const cached = await getCache(CACHE_KEYS.FEATURED_PRODUCTS);
        if (cached) {
            return res.status(200).json({ products: cached, fromCache: true });
        }

        const featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }

        await setCache(CACHE_KEYS.FEATURED_PRODUCTS, featuredProducts, CACHE_TTL.FEATURED);

        res.status(200).json({ products: featuredProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });   
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, isFeatured, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            isFeatured,
            image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
            category,
        });

        await invalidateCache("products:*");

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.log("Error deleting image from Cloudinary:", error);
            }
        }

        await Product.findByIdAndDelete(productId);

        await invalidateCache("products:*");

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const cacheKey = CACHE_KEYS.CATEGORY(category);
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json({ products: cached, fromCache: true });
        }

        const products = await Product.find({ category }).lean();
  
        await setCache(cacheKey, products, CACHE_TTL.CATEGORY);
        
        res.status(200).json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
  
            await invalidateCache(CACHE_KEYS.FEATURED_PRODUCTS);
            
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};