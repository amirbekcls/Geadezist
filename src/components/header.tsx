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
    else if (role === "ROLE_CLIENT") return "Mexmon";
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
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    window.location.reload(); // Optional: Redirect to the login page or refresh
  };
  // useEffect(() => {
  //   if (token) {
  //     FetchUserData();
  //   }
  // },[token])
 
  useEffect(() => {
    console.log("Updated data:", data); // data o'zgarganda kuzatish
  }, [data]);

  return (
    <div className="flex flex-col py-5 px-5">
      <div className="flex flex-col">
        <button onClick={handleLogout}>Logout</button>
        <ol className="">
          {data ? (
            <>
            <li className="font-bold text-sm">{data.fullName} | {ChekName()} </li>
            <li className="font-bold text-sm"> {data.email}</li>
            </>
          ) : (
            <p>Malumot kelmadi</p>
          )}
        </ol>

      </div>
    </div>
  );
}

export default Header;
