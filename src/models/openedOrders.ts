import { Schema, model, models } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const openedOrdersSchema = new Schema(
  {
    userId: reqString,
    username: reqString,
    productId: reqNumber,
    productName: reqString,
    transactionId: reqString,
    price: reqNumber,
    currency: reqString,
  },
  {
    timestamps: true,
  }
);

export type OpenedOrders = {
  userId: string;
  username: string;
  productId: number;
  productName: string;
  transactionId: string;
  price: number;
  currency: string;
};

const name = "opened-orders";

export default models[name] || model(name, openedOrdersSchema, name);
