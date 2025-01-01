// Global/GlobalDeleteFunc.ts
import axios from "axios";
import { toast } from "react-toastify";

export const deleteResource = async (id: number, resourceType: string, token: string | null): Promise<boolean> => {
  try {
    const response = await axios.delete(
      `http://142.93.106.195:9090/${resourceType}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(`${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} successfully deleted.`);
      return true; 
    } else {
      toast.error(`Failed to delete ${resourceType}.`);
      return false; 
    }
  } catch (err) {
    console.error("Error during delete:", err);
    toast.error(`Failed to delete ${resourceType}.`);
    return false; 
  }
};
