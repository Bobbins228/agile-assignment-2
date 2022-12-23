import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// Connect to database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_DB);

const db = mongoose.connection;

db.on('error', (err) => {
    console.info(`database connection error: ${err}`);
});
db.on('disconnected', () => {
    console.info('database disconnected');
});
db.once('open', () => {
    console.info(`database connected to ${db.name} on ${db.host}`);
})