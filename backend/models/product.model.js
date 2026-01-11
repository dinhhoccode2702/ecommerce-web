import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            min: 0,
            required: true,
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        category: {
            type: String,
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

// Tìm sản phẩm theo danh mục - dùng rất nhiều
productSchema.index({ category: 1 });

// Lấy sản phẩm nổi bật - trang chủ
productSchema.index({ isFeatured: 1 });

// Tìm sản phẩm featured trong 1 category
productSchema.index({ category: 1, isFeatured: 1 });

// Index cho sắp xếp theo ngày tạo (mới nhất)
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;