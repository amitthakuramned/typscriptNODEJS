import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: {
      type: String,
      require: true,
    },
    mimetype: {
        type: String,
        require: false,
      },
      path: {
        type: String,
        require: true,
      },
  },{timestamps:true});
  
  mongoose.model("File", fileSchema);