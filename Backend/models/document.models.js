import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
    documentImage: {
        type: String,
    },
    selfieLive: {
        type: String,
    },
    fatherName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: String,
    },
});

const Document = mongoose.model("Document", DocSchema);

export default Document;