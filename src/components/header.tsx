import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

function Header() {
 
  console.log(useAuthStore);
  const role = sessionStorage.getItem('role')
  const ChekName = () => {
    if (role === "ROLE_SUPER_ADMIN") return "Super Admin"
    else if (role === "ROLE_ADMIN") return "Admin"
    else if (role === "ROLE_TESTER") return "Tester"
    else if (role === "ROLE_CLIENT") return "user"


  }
  useEffect(() => {
    ChekName()
  }, [ChekName()])
  console.log(ChekName());
  
  return (
    <div>
      {/* <h1>First name: {firstname || "Uzur Ismiz Topilmadi"}</h1> */}
    <h1>Name : {ChekName()}</h1>
    </div>
  );
}
export default Header
