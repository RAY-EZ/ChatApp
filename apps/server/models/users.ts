import mongoose from 'mongoose';
import crypto from 'crypto';

export interface userAttrs {
  username: string;
  password: string;
}

interface userModel extends mongoose.Model<userAttrs> {
  build(attrs: userAttrs): Promise<mongoose.HydratedDocument<userAttrs>>;
}
const userSchema = new mongoose.Schema<userAttrs, userModel>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},{
  toJSON: {
    transform(doc: userAttrs, ret){
      ret.password = undefined;
      ret.id = ret._id;
      ret._id = undefined;
      ret.__v = undefined;
    }
  }
})

userSchema.statics.build = function(attrs: userAttrs){
  return new User(attrs);
}

/* Hook to hash password before saving */
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  const plainPassword = this.password;
  const salt = crypto.randomBytes(16).toString('base64');
  const hmac = crypto.createHmac('sha256',salt);
  let hash = hmac.update(plainPassword, 'utf-8').digest().toString('base64');
  const hashPassword = salt + '.' + hash;

  this.password = hashPassword;
  next();
})

const User = mongoose.model<userAttrs, userModel>('User', userSchema)

export default User;