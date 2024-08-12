import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const Question = sequelize.define('Question', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  index: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

// export default Question;
