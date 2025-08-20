"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (typeof mongoUri !== 'string' || mongoUri.trim().length === 0) {
            console.error('MONGO_URI is not defined. Set it in your environment or .env file.');
            process.exit(1);
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        else {
            console.error('Unknown error', error);
        }
        process.exit(1);
    }
};
exports.default = connectDB;
