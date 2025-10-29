export const getAvatarPath = (file: any, isGroup: boolean = false) => {
  if (file && typeof file === "string") return file;

  if (file && typeof file === "object") {
    return file.uri;
  }

  if (isGroup) return require("../assets/images/defaultGroupAvatar.png");

  return require("../assets/images/defaultAvatar.png");
};
