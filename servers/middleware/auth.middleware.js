import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
import { User } from "../module/User.js"; // Sequelize User model

export const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(404, "No token provided");
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user by decoded token's id
        const user = await User.findOne({
            where: { id: decodedToken._id },
            attributes: { exclude: ['password', 'refreshToken'] }
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Attach user object to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyjwt middleware:", error);
        // Respond with an error
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

export const authorizedRoles = (...roles) => async (req, res, next) => {
    try {
        const currentUserRole = req.user.role;

        if (!roles.includes(currentUserRole)) {
            throw new ApiError(403, "You do not have permission to access this resource");
        }

        next();
    } catch (error) {
        console.error("Error in authorizedRoles middleware:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
