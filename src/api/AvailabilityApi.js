import API from './axios';

export const AvailabilityAPI = {
  add: (data) => API.post("/availability", data),
  delete: (id) => API.delete(`/availability/${id}`),
  get:(doctorId,startDate,endDate,availabilityStatus) =>{
    let url = `/availability?doctorId=${doctorId}`;
    if(startDate) url += `&startDate=${startDate}`;
    if(endDate) url += `&endDate=${endDate}`;
    if(availabilityStatus) url += `&availabilityStatus=${availabilityStatus}`;
    return API.get(url);
  },
};
