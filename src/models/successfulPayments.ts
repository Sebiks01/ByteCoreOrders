import { Schema, model, models } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const successfulPaymentsSchema = new Schema(
  {
    userId: reqString,
    username: reqString,
    sessionId: reqString,
    customerEmail: reqString,
    price: reqNumber,
    currency: reqString,
    status: reqString,
  },
  {
    timestamps: true,
  }
);

export type SuccessfulPayments = {
  userId: string;
  username: string;
  sessionId: string;
  customerEmail: string;
  price: number;
  currency: string;
  status: string;
};

const name = "successful-payments";

export default models[name] || model(name, successfulPaymentsSchema, name);
