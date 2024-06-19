import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
    aid: String,
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
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        default: '',
    },
    currency: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    photo1: {
        type: String,
    },
    photo2: {
        type: String,
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
    negotiation: {
        type: String,
        required: true,
    },
    availabilty: {
        type: String,
        enum: ['available', 'not available'],
        default: 'available',
    },
    verification: {
        type: String,
        enum: ['verified', 'not verified'],
        default: 'not verified',
    },
    sponsored: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: String,
        required: true,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

// Define a virtual property to format the price with commas
apartmentSchema.virtual('formattedPrice').get(function() {
    return this.price.toLocaleString();
});

const Apartments = mongoose.model('apartments', apartmentSchema);

export default Apartments;

