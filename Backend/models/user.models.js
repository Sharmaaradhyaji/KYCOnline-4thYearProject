import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            firstname: {
                type: String,
                required: true,
            },
            lastname: {
                type: String,
                required: true,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign(
            { _id: this._id.toString() },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );
        return token;
    } catch (error) {
        console.log(error);
    }
};

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log(error);
    }
};

userSchema.statics.hashPassword = async function (password) {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};

const User = mongoose.model("User", userSchema);

export default User;