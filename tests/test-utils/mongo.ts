import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

export async function setupInMemoryMongo() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("imageboard_test");

    return {
        mongod,
        client,
        db,
        async cleanup() {
            await client.close();
            await mongod.stop();
        },
    };
}
