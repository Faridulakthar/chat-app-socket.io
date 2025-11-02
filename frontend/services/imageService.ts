import { CLOUDINARY_CLOUD_NAME } from "@/constants";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;



export const getAvatarPath = (file: any, isGroup: boolean = false) => {
  if (file && typeof file === "string") return file;

  if (file && typeof file === "object") {
    return file.uri;
  }

  if (isGroup) return require("../assets/images/defaultGroupAvatar.png");

  return require("../assets/images/defaultAvatar.png");
};
