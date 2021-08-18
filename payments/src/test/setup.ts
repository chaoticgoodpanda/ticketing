import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

//hook function -- runs before all of our tests are executed
beforeAll(async () => {
    process.env.JWT_KEY = 'adjkadhkjdfh';
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    
    await mongoose.connect(mongoUri, {
       useNewUrlParser: true,
       useUnifiedTopology: true 
    });
});

//another hook run before each test
beforeEach(async () => {
    jest.clearAllMocks();
   const collections = await mongoose.connection.db.collections();
   
   //delete all data before each test
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

//hook runs after all tests are complete
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


//helper function for signing up new user and assigning cookie so don't have to keep rewriting code
//this is code refactoring
// we can either provide a custom id as a string, or if we provide nothing, will auto-generate an id from mongoose
global.signin = (id?: string) => {
    // Build a JSON web token payload. {id, email}
    const payload = {
        // generates random id each time global.signin() function is called
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    
    // Build the session object {jwt: blabla}
    const session = { jwt: token };
    
    // Turn session into JSON
    const sessionJSON = JSON.stringify(session);
    
    // Take JSON and encode as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    
    // return a string that's a cookie with the encoded data
    // have to return an array instead of a mere string b/c the cookie handler expecting an array
    return [`express:sess=${base64}`];
    
};
