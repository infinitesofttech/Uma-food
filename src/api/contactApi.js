import axiosInstance from "./axiosInstance";

// Get contact subjects
export const getContactSubjects = async () => {
  const res = await axiosInstance.get("/admin/contact-subjects/");
  return res.data;
};

// Submit contact form
export const sendContactMessage = async (payload) => {
  const res = await axiosInstance.post("/contact/", payload);
  return res.data;
};