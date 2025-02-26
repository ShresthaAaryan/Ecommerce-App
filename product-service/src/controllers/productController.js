const Product = require("../models/Product")

const createProduct = async (req, res) =>{
    try{
        const { name, price, description } = req.body

        if(!name || !price){
            return res.status(400).json({ message: "Name and price are required" })
        }

        const newProduct = new Product({
            name,
            price, 
            description,
        })

        await newProduct.save()

        res.status(201).json({ message: "Product created successfully", product: newProduct })
    }
    catch(error){
        console.error('Error creating product:', error.messgae)
        res.status(500).json({ message: "Server Error" })
    }
}

const getProduct = async (req, res) =>{
    try{
        const products = await Product.find()
        res.status(200).json({ products })
    }
    catch(error){
        console.error("Error Fetching products", error.message)
        res.status(500).json({ message: "Server Error" })
    }
}


const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ product });
    } catch (error) {
      console.error("Error fetching product:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const updateProduct = async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, description },
        { new: true } // Return the updated product
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product updated", product });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      console.error("Error deleting product:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  module.exports = {
    createProduct,
    getProduct, 
    getProductById,
    updateProduct,
    deleteProduct,
  };