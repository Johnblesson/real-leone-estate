import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    typeOfProperty: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    apartmentsPhoto: {
        type: String, // Or Buffer if storing Base64 data
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    }, 
    address: {
        type: String,
    },
    address2: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const Apartments = mongoose.model('apartments', apartmentSchema);

export default Apartments;
