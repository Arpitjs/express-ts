import mongoose from "mongoose";
import * as bcrypt from 'bcryptjs'
import config from "config";

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next) {
    let user = this as UserDocument;
    if(!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
})

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    const user = this as UserDocument;
    return bcrypt.compare(password, user.password)
    .catch(() => false);
}

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
