
import axiosInstance from "./axiosInstance";

 const registerUser = async (userData) => {
  const res = await axiosInstance.post(
    "/register/",
    userData
  );
  return res.data;
};
export default registerUser;
