import mongoose, {Schema} from 'mongoose';
import jwt from  "jsonwebtoken"
import bcrypt from "bcryptjs"
import { use } from 'react';


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true, 
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true, 
        },

        avatar: {
            type: String, //cloudinary url
            required: true,
        },
        coverImage: {
            type: String, //cloudinary url
            
        },
        watachHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }

        ],

        password: {
            type: String,
            required: [true, "Please provide a password"],
        
        },
        refreshToken: {
            type: String,
        },


    },
    {
        timestamps: true,

    }



)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            username: this.username,
            email: this.email,  
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.refreshAccessToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);