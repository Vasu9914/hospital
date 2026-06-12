import API from './axios';

export const SlotAPI = {
  getAll: (
    doctorId,
    startDate,
    endDate,
    slotStatus,
    page = 0,
    size = 6
  ) => {

    const params = {
      page,     
      size      
    };
    if(doctorId) params.doctorId = doctorId;
    if(slotStatus) params.slotStatus = slotStatus;
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return API.get('/slots', { params });
  },
  delete: (id) => API.delete(`/slots/${id}`),
  getslotsbyavailability: (availabilityId) => API.get(`/slots/by-availability/${availabilityId}`),
};