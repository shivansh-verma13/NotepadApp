import app from "./app.js";
import { connectToDatabase } from "./db/connections.js";

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(4040, () => {
      console.log(
        "The Server is up and running and connected to the Database!"
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

startServer();
