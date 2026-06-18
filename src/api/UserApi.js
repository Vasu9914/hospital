import API from './axios';

export const UserAPI = {
  updatephoto: (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.put(`/user/${id}/profile-photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
};