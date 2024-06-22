import mongoose from "mongoose";

const applySchema = new mongoose.Schema({
    phone: String,
    location: String,
    username: String,
    applyAid: String,
    address: String,
    address2: String,
    createdBy : String,
    comments : String,
    assignedStaff: String,
    staffInCharge: String,
    apartments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const Application = mongoose.model('applications', applySchema);

export default Application;
