import mongoose from "mongoose";





const ExcelSchema = new mongoose.Schema(
  {
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Excel = mongoose.models.Excel || mongoose.model("Excel", ExcelSchema);
export default Excel;