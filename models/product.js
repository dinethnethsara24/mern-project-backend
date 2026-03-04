import mongoose from 'mongoose';

const productSchema = mongoose.Schema({

  productId: {
    type: String,
    required: true,
    unique: true
  },

  productName: {
    type: String,
    required: true,
    unique: true
  },

  altNames: [
    { type: String }
  ],

  imgUrls: [
    { type: String }
  ],

  labeledPrice: {
    type: Number,
    required: true
  },

  sellingPrice: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  }
})

const Product = mongoose.model("Products", productSchema)

export default Product;