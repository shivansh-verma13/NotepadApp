import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("Could not connect to MongoDB: ", error.message);
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log("Could not disconnect from MongoDB: ", error.message);
  }
}

export { connectToDatabase, disconnectFromDatabase };
