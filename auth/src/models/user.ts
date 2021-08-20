import * as mongoose from "mongoose";
import {Password} from "../services/password";

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string,
    password: string
}


//interface describing the properties a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties a user document has
//any additional properties mongoose adds after the user has initially created an account apply here
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { 
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

//take in new password and hash it
userSchema.pre('save', async function(done) {
  if (this.isModified('password'))   {
      const hashed = await Password.toHash(this.get('password'));
      this.set('password', hashed);
  }
  
  done();
})

//building in a static property into schema
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
//     email: 'test@test.com',
//     password: 'password',
// })



export { User  };