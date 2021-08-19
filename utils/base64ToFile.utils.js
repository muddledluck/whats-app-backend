import path from "path";
import fs from "fs";
import fileType from "file-type";
import services from "./services.js";

async function base64ToFileUrl(base64, userId, folderName) {
  const buffer = new Buffer.from(base64, "base64");
  const extention = await fileType.fromBuffer(buffer);
  const filePath = path.resolve(`./public/media/${userId}`);
  const fileName = `${userId}-${Date.now()}.${extention.ext}`;

  const localPath = `${filePath}/${folderName}`;
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath, { recursive: true });
  }

  fs.writeFileSync(`${localPath}/${fileName}`, buffer, "utf8");

  const url = `${services.url}/media/${userId}/${folderName}/${fileName}`;
  return url;
}

export default base64ToFileUrl;
