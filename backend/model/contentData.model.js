import mongoose from "mongoose";

const ContentDataSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  items: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { timestamps: true, collection: "frontendContent" });

const ContentDataModel = mongoose.model("FrontendContent", ContentDataSchema);
export default ContentDataModel;
