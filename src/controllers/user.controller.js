import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//get user details from frontend
//validation - should not be empty
//check if user already exists: username, email
//check for images, check for avatar
//upload images to cloudinary
//create user object and save to db
//remove password and refresh token field from response
//check for user creation
//return res 

    const {fullName, email, username, password, avatar} = req.body
    console.log("email: ", email);


    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError("All fields are required", 400);
    }
    const existedUser = User.findOne({$or: [{email}, {username}]})

    if(existedUser) {
        throw new ApiError("User already exists", 409);
    }

    const avatarLocalPath  = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;


    if(!avatarLocalPath) {
        throw new ApiError("Avatar is required", 400);
    }

    const avatarResponse = await uploadOnCloudinary(avatarLocalPath)
    const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError("Avatar file is required" , 400);
    }

    const user = await User.create({
        fullName,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError("User creation failed", 500);
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));



export {registerUser};