import { createClient } from "@redis/client";
import RedisClient from "@redis/client/dist/lib/client";

class RedisInstance{
  _connectionObject: ReturnType<typeof RedisClient.create> | null;
  
  constructor(){
    this._connectionObject = null;
  }
  async connect(){
    try{
      this._connectionObject = createClient();
      await this._connectionObject.connect();

    } catch(e){
      if(e instanceof Error){
        e.message = "Unable to connect to redis: "+ e.message;
        throw e;
      }
    }
  }

  async disconnect(){
    await this._connectionObject.disconnect();
  }

  get instance(){
    if(this._connectionObject == null) throw new Error('not connected to redis');
    return this._connectionObject;
  }
}

export default new RedisInstance();