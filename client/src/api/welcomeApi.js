import api from "./api";

export const getWelcome = () => api.get("/welcome-cms");

export const updateWelcome = (data) => api.put("/welcome-cms/admin", data);

export const addImage = (formData) =>
  api.post("/welcome-cms/admin/carousel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateImage = (id, formData) =>
  api.put(`/welcome-cms/admin/carousel/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteImage = (id) =>
  api.delete(`/welcome-cms/admin/carousel/${id}`);

