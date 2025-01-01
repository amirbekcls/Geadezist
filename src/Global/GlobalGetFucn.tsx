import axios from "axios";
import { toast } from "react-toastify";
import { URL_ALL } from "../api/api";
export const fetchData = async (url: string, token: string) => {
  try {
    const response = await axios.get(`${URL_ALL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.body; // Data successful bo'lsa, qaytaramiz
    } else {
      toast.error("Failed to fetch data.");
    }
  } catch (err) {
    toast.error("Error fetching data.");
    console.error(err);
  }
  return []; // Hato bo'lsa bo'sh massiv qaytaramiz
};
