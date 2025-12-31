// frontend/src/components/CreateProductForm.jsx
import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Upload, Loader } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const { createProduct, loading } = useProductStore();

    // 📌 Xử lý upload image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            
            reader.readAsDataURL(file);  // Convert sang Base64
        }
    };

    // 📌 Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.image) {
            return toast.error("Please fill all fields");
        }

        // Create product
        await createProduct(newProduct);

        // Reset form
        setNewProduct({
            name: "",
            description: "",
            price: "",
            category: "",
            image: "",
        });
    };

    return (
        <div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>
                Create New Product
            </h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Name Input */}
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                {/* Description Textarea */}
                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                {/* Price Input */}
                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    />
                </div>

                {/* Category Select */}
                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                        required
                    >
                        <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div className='mt-1 flex items-center'>
                    <input 
                        type='file' 
                        id='image' 
                        className='sr-only' 
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && (
                        <span className='ml-3 text-sm text-gray-400'>Image uploaded</span>
                    )}
                </div>

                {/* Image Preview */}
                {newProduct.image && (
                    <div className='mt-4'>
                        <img
                            src={newProduct.image}
                            alt='Product preview'
                            className='w-full h-40 object-cover rounded-lg'
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' />
                            Creating...
                        </>
                    ) : (
                        <>Create Product</>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;