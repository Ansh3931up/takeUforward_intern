import app from "./app.js";
import sequelize from '../config/database.js';
import  {User} from '../module/User.js';
import {Question} from '../module/Question.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Sync and alter tables if needed
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

const PORT = 5050;

// Synchronize the database and then start the server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
  });
