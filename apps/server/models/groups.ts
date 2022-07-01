import mongoose, { SchemaType, HydratedDocument, Types, mongo } from 'mongoose';
import crypto from 'crypto';
import base from 'base-x'
import { userAttrs } from './users';
/**
 * Permission Level
 * Promote   Add      Read/Write       
 * /Remove
 *  4         2          1         -- Admin
 *  0         2          1         -- Co-admin
 *  0         0          1         -- member     
 */
export enum memberLevel {
  admin = '421',
  coAdmin = '021',
  member = '001'
}

interface groupAttr {
  name: string;
  isProtected: boolean;
  password?: string;
  g_id?: string;
  // members?: [{ user: string, level?: string}];
  members?: {user: Types.ObjectId | string, level?: memberLevel}[];
}
interface groupMethods {
  AddMemberById(userid: mongoose.Types.ObjectId | string): HydratedDocument<groupAttr>;
  RemoveMemberById(userid: mongoose.Types.ObjectId | string):Promise<HydratedDocument<groupAttr>>;
}

interface groupModel extends mongoose.Model<groupAttr, {} ,groupMethods> {
  build(attrs: groupAttr): mongoose.HydratedDocument<groupAttr>;
}


const groupSchema= new mongoose.Schema<groupAttr, groupModel, groupMethods>({
  name: {
    type: String,
    required: true
  },
  isProtected: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,

    required: [function(){
      return this.isProtected as boolean
    }, "required password"],
  },
  g_id: {
    type: String
  },
  members: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
      level: {
        type: String,
        enum: memberLevel,
        default: memberLevel.member
      },
      _id: false
    }
  ]
},{
  toJSON: {
    transform(doc: groupAttr, ret){
      ret.password = undefined;
      ret.id = ret._id;
      ret._id = undefined;
      ret.__v = undefined;
    },
    virtuals: true
  },
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

// console.log(groupSchema.paths);

groupSchema.methods.AddMemberById = function(this:HydratedDocument<groupAttr>, userid: mongoose.Types.ObjectId | string){
  this.members = [
    ...this.members,
    {
      user: userid
    }
  ]

  return this;
}

groupSchema.methods.RemoveMemberById = async function(this:HydratedDocument<groupAttr>, userid: mongoose.Types.ObjectId){
  this.members = this.members.filter(({user}) =>{ 
    // console.log(userid.equals(user), userid, user)
    return !userid.equals(user)
  
  })
  return this;
}

groupSchema.methods.updateMemberLevelById = function(userid: mongoose.Types.ObjectId, level: string){
  return new Group()
}

groupSchema.methods.setPassword = async function(password: string){
  // if(!this.isModified('password')) return next();
  // const plainPassword = this.password;
  // const salt = crypto.randomBytes(16).toString('base64');
  // const hmac = crypto.createHmac('sha256',salt);
  // let hash = hmac.update(plainPassword, 'utf-8').digest().toString('base64');
  // const hashPassword = salt + '.' + hash;

  // this.password = hashPassword;
}
groupSchema.methods.removePassword = async function (password: string){

}
groupSchema.methods.comparePassword = async function(password: string){

}

groupSchema.statics.getGroupsByMemberId = function(userid: mongoose.Types.ObjectId){
  const group = Group.aggregate([
    {
      $match: {}
    },
    {
      $group: {

      }
    }
  ]);
}

groupSchema.statics.build = function(attrs: groupAttr){
  return new Group(attrs);
}
/* Hook to hash password before saving */
groupSchema.pre('save',async function(next){

  next();
})


groupSchema.pre('save', async function(next){
  if(!this.isNew) return next()

  let {name, id} = this;
  const base32 = base('0123456789ABCDEFGHJKMNPQRSTVWXYZ');
  const hash = crypto.createHash('sha256');
  let buffer = hash.update(`${name}.${id}`).digest();

  const g_id = base32.encode(buffer);

  this.g_id = g_id.slice(0,5);
  next()
})

const Group = mongoose.model<groupAttr, groupModel>('Group', groupSchema)

export default Group;