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
    bio: String, // Bio is not required by default, so no need to specify required property
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
    tel: {
        type: Number,
    },
    address: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const Apartments = mongoose.model('apartments', apartmentSchema);

export default Apartments;
