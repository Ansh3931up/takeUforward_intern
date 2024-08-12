import { User } from '../module/User.js'; // Sequelize User model
import ApiError from '../utilities/ApiError.js';
import { Sequelize, Op } from 'sequelize';

import ApiResponse from '../utilities/ApiResponse.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { uploadOnCloudinary } from '../utilities/cloudinary.js';
import sendEmail from '../utilities/sendEmail.js';
import crypto from "crypto";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['posts'] } // Adjust based on your table structure
    });
    return res.status(200).json(new ApiResponse(200, users, "All users present"));
});

const generateAccessandrefershToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validate: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Unable to generate access and refresh token");
    }
};

const options = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'None'
};

const register = asyncHandler(async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if ([fullname, email, password].some((item) => item?.trim() === '')) {
        throw new ApiError(404, "Data is incomplete");
    }

    const existing = await User.findOne({
        where: {
            [Sequelize.Op.or]: [{ email }, { fullname }]
        }
    });

    if (existing) {
        throw new ApiError(404, "This user already exists");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar path is not found");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar is unable to be stored");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        password,
        role,
    });

    const createUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!createUser) {
        throw new ApiError(400, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createUser, "User created successfully"));
});

const login = asyncHandler(async (req, res) => {
    const {  email, password } = req.body;

    const user = await User.findOne({
        where: {
            [Sequelize.Op.or]: [{ email }]
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(404, "Password incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessandrefershToken(user.id);
    return res
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .status(200)
        .json(new ApiResponse(200, user, 'You are logged in'));
});

const logout = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "No user logged in");
    }

    await User.update(
        { refreshToken: null },
        { where: { id: req.user.id } }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const getProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "User data"));
});

const forgot = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    const resetToken = await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
    try {
        await sendEmail(email, 'Password Reset', `Reset your password using this link: ${resetPasswordURL}`);
        res.status(200).json(new ApiResponse(200, `Reset password token has been sent to ${email} successfully`));
    } catch (error) {
        user.forgotPasswordExpiry = null;
        user.forgotPasswordToken = null;
        await user.save();
        res.status(500).json(new ApiError(500, "Email not sent"));
    }
});

const reset = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        where: {
            forgotPasswordToken,
            forgotPasswordExpiry: { [Sequelize.Op.gt]: Date.now() }
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found or token expired");
    }

    user.password = password;
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;

    await user.save();
    return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user?.id);

    const isPasswordValid = await user.verifyPassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Unauthorized access - wrong password");
    }

    user.password = newPassword;
    await user.save({ validate: false });

    return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email} = req.body;

    if (!fullname || !email ) {
        throw new ApiError(404, "All fields are required");
    }

    const updatedUser = await User.update(
        { fullname, email },
        { where: { id: req.user?.id }, returning: true, individualHooks: true }
    );

    const newuser = updatedUser[1][0];
    return res.status(200).json(new ApiResponse(200, newuser, "Account details updated successfully"));
});

const addQuestionByIdTouser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const user = req.user;

    if (!user.isSubscribed.includes(id)) {
        user.isSubscribed.push(id);
    }

    await user.save();
    return res.status(200).json(new ApiResponse(200, user, "Subscription updated"));
});

export { register, getAllUsers, login, logout, addQuestionByIdTouser, getProfile, forgot, reset, updateAccountDetails, changeCurrentPassword, getCurrentUser };
