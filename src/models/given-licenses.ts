import { Schema, model, models } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const givenLicensesSchema = new Schema(
  {
    userId: reqString,
    username: reqString,
    sessionId: reqString,
    customerEmail: reqString,
    price: reqNumber,
    currency: reqString,
    license: {
      productId: reqNumber,
      description: reqString,
      addressLimit: reqNumber,
      addressDuration: reqNumber,
      addons: [reqNumber],
    },
  },
  {
    timestamps: true,
  }
);

export type GivenLicenses = {
  userId: string;
  username: string;
  sessionId: string;
  customerEmail: string;
  price: number;
  currency: string;
  license: {
    productId: number;
    description: string;
    addressLimit: number;
    addressDuration: number;
    addons: number[];
  };
};

const name = "given-licenses";

export default models[name] || model(name, givenLicensesSchema, name);
