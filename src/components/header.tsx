import { useEffect, useState } from "react";
import axios from "axios";
import { UserGetMe } from "../api/api";

type UserType = {
  fullName: string,
  email: string,
  fileId?: number,
}

function Header() {
  const [data, setData] = useState<UserType | null>(null);
  const role = sessionStorage.getItem("role");

  const ChekName = () => {
    if (role === "ROLE_SUPER_ADMIN") return "Super Admin";
    else if (role === "ROLE_ADMIN") return "Admin";
    else if (role === "ROLE_TESTER") return "Tester";
    else if (role === "ROLE_CLIENT") return "User";
    else return "Unknown Role";
  };

  useEffect(() => {

    const FetchUserData = async () => {

      let token = sessionStorage.getItem("token");

      try {

        const response = await axios.get(UserGetMe, {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });

        console.log("Response data:", response.data);

        setData(response.data.body);

      } catch (error) {

        console.error("Error fetching user data:", error);

      }
    };

    FetchUserData();

  }, []);

  useEffect(() => {
    console.log("Updated data:", data); // data o'zgarganda kuzatish
  }, [data]);

  return (
    <div>
      <h1>Name: {ChekName()}</h1>
       {data ? (
        <li>{data.fullName} - {data.email}</li>
       ) : (
        <p>Malumot kelmadi</p>
       )}
    </div>
  );
}

export default Header;
