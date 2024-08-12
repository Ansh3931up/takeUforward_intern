import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const User = sequelize.define('User', {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, Infinity]
    }
  },
  avatar: {
    type: DataTypes.STRING, // cloudinary url
    allowNull: false
  },
  isSubscribed: {
    type: DataTypes.JSON, // or use a specific schema if needed
    defaultValue: []
  },
  refreshToken: {
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('USER', 'ADMIN'),
    defaultValue: 'USER'
  },
  forgotPasswordToken: {
    type: DataTypes.STRING
  },
  forgotPasswordExpiry: {
    type: DataTypes.DATE
  },
  subscription: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true,
});

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.verifyPassword = async function(password) {
  if (!this.password || !password) {
    throw new Error("password or this.password is not defined");
  }
  return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

User.prototype.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

User.prototype.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.forgotPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min from now
  return resetToken;
};

// export default User;
