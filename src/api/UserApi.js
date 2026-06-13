import API from './axios';

export const UserAPI = {
  updatephoto: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return API.put("/user/profile/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};