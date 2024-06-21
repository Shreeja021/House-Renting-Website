import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who is the seller
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    price: { type: Number, required: true },
    numberOfBedrooms: { type: Number, required: true },
    numberOfBathrooms: { type: Number, required: true },
    area: { type: Number, required: true }, // in square feet
    amenities: { type: [String], default: [] }, // e.g., ["pool", "gym", "garden"]
    images: [{ type: [String], default: [] }], 
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

const Property = mongoose.model("Product", propertySchema);

export default Property;