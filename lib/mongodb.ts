import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // Reuse the client across HMR reloads in dev
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, create a new client
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
