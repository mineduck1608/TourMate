import http from "../utils/http";

export const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await http.post("/imagekit/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url; // 👈 đảm bảo API trả về `url` sau khi upload
};
