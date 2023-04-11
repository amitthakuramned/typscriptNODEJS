import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../api/controllers/common/constants.js";
import shortid from "shortid";
import { createWriteStream, mkdir } from "fs";

const storeUpload = async ({ stream, filename, mimetype }) => {
    const id = shortid.generate();
    const path = `Upload/${id}-${filename}`;
    // (createWriteStream) writes our file to the images directory
    return new Promise((resolve, reject) =>
      stream
        .pipe(createWriteStream(path))
        .on("finish", () => resolve({ id, path, filename, mimetype }))
        .on("error", reject)
    );
  };

  const processUpload = async (upload) => {
    const { createReadStream, filename, mimetype } = await upload;
    const stream = createReadStream();
    const file = await storeUpload({ stream, filename, mimetype });
    return file;
  };

const User = mongoose.model("User");
const File = mongoose.model("File");

const FileResolvers = {
  Query: {

  },
  Mutation: {
      uploadFile: async (_, { file }) => {
        console.log('>>>>>>',file)
        mkdir("Upload", { recursive: true }, (err) => {
          if (err) throw err;
        });
        const upload = await processUpload(file);
        // save our file to the mongodb
        // await File.create(upload);
        console.log('>>>>>>',file,upload)
        return upload;
      },
  },
};

export default FileResolvers;
