import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  fatherName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  panNumber: { type: String, required: true },
  adhaarNumber: { type: String, required: true },
  gender: { type: String, required: true },
  panImage: { type: String, required: true },
  adhaarImage: { type: String, required: true },
  selfieImage: { type: String, required: true },
});

const Kyc = mongoose.model("Kyc", kycSchema);
export default Kyc;
