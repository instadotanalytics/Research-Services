import api from "./api.js";

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append("image", file);
  return api.post("/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
