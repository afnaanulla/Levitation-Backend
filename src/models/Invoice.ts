import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  qty: number;
  rate: number;
  total: number;
  gst: number;
}

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  products: IProduct[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
}

const invoiceSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  products: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
    gst: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  grandTotal: { type: Number, required: true }
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);