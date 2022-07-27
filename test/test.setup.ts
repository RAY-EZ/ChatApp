import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose';

let mongodb: null | MongoMemoryServer = null 

beforeAll(async ()=>{
  mongodb = await MongoMemoryServer.create();
  let uri = mongodb.getUri();
  // console.log(uri);
  await mongoose.connect(uri)
})


beforeEach(async ()=>{
  let collections = await mongoose.connection.db.collections();
  for(let collection of collections){
    await collection.deleteMany({});
  }
})

afterAll(async ()=>{
  await mongodb.stop()
  await mongoose.connection.close();

  // console.log(mongoose.connection)
})