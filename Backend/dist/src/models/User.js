import mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, {
    timestamps: true,
});
const User = mongoose.models.User || model("User", userSchema);
export default User;
//# sourceMappingURL=User.js.map