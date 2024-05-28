import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    bio: String, // Bio is not required by default, so no need to specify required property
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    accountant: {
        type: Boolean,
        default: false,
    },
    sudo: {
        type: Boolean,
        default: false,
    },
    // termsConditions: {
    //     type: Boolean,
    //   },
    //   serviceFee: {
    //     type: Boolean,
    //   },
    //   privacyPolicy: {
    //     type: Boolean,
    //   },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const User = mongoose.model('users', userSchema);

export default User;
