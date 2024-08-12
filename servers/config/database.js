import { Sequelize } from 'sequelize';

// require('dotenv').config(); // Load environment variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Depending on your setup, you might need this
        }
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    export default sequelize;
// Use sequelize to define models and perform database operations
