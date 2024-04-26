import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     fullname: {
//         type: String,
//         required: true,
//     },
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     photo: {
//         data: Buffer, // Or type: String if storing Base64-encoded data
//         contentType: String, // MIME type of the photo (e.g., image/jpeg, image/png)
//         required: true,
//     },    
//     bio: {
//         type: String,
//         required: false,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user',
//     },
//     status: {
//         type: String,
//         enum: ['active', 'inactive'], // You can adjust the enum values as needed
//         default: 'active',
//     },
//     sudo: {
//         type: Boolean,
//         default: false, // Set sudo to false by default
//     },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// }, {
//     timestamps: true,
// });

// const User = mongoose.model('users', userSchema);

// export default User;

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
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String, // Or Buffer if storing Base64 data
        required: true,
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
    sudo: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const User = mongoose.model('users', userSchema);

export default User;
