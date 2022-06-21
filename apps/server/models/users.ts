import mongoose from 'mongoose';

interface userAttrs {
  name: string;
  username: string;
  password: string;
}

interface userModel extends mongoose.Model<userAttrs> {
  build(attrs: userAttrs): Promise<mongoose.HydratedDocument<userAttrs>>;
}
const userSchema = new mongoose.Schema<userAttrs, userModel>({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.statics.build = function(attrs: userAttrs){
  return new User(attrs);
}

const User = mongoose.model<userAttrs, userModel>('User', userSchema)


export default User;