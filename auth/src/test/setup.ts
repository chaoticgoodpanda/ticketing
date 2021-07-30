import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import { app} from "../app";
import request from "supertest";

declare global {
    var signin: () => Promise<string[]>;
}

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
global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';
    
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);
    
    const cookie = response.get('Set-Cookie');
    
    return cookie;
    
};
