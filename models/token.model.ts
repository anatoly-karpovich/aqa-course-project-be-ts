import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

export default mongoose.model<IToken>("Token", TokenSchema);
