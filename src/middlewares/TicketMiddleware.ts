import { Options, diskStorage } from "multer";
import { resolve } from "path";

const storageTypes = {
  local: diskStorage({
    destination: (request, response, callback) => {
      callback(null, resolve(__dirname, "..", "..", "uploads", "tickets"));
    },
    filename: (request, file, callback) => {
      callback(null, `${new Date().toISOString()}-${file.originalname}`);
    },
  }),
};

export const TicketMiddleware = {
  dest: resolve(__dirname, "..", "..", "uploads", "tickets"),
  storage: storageTypes["local"],
} as Options;
