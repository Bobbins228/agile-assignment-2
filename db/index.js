import dotenv from 'dotenv';
import mongoose from 'mongoose';
import loglevel from 'loglevel';
dotenv.config();

// Connect to database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_DB);

const db = mongoose.connection;

db.on('error', (err) => {
    loglevel(`database connection error: ${err}`);
});
db.on('disconnected', () => {
    loglevel('database disconnected');
});
db.once('open', () => {
    loglevel(`database connected to ${db.name} on ${db.host}`);
})