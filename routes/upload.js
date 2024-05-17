import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dirPath = join(__dirname, "../", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirPath);
  },
});

export const upload = multer({ storage });
