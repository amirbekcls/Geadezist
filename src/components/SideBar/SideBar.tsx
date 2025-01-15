import  { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();
  // const navigate = useNavigate();

  const menuItems = [
    {
      name: "Бошқарув панели",
      path: "/dashboard",
      roles: ["ROLE_SUPER_ADMIN"],
    },
    {
      name: "Категория",
      path: "/categories",
      roles: ["ROLE_SUPER_ADMIN", "ROLE_TESTER"],
    },
    {
      name: "Тест",
      path: "/test ",
      roles: ["ROLE_SUPER_ADMIN", "ROLE_TESTER"],
    },
    {
      name: "Фойдаланувчилар",
      path: "/users",
      roles: ["ROLE_SUPER_ADMIN"],
    },
    {
      name: "Фойдаланувчилар натижаси",
      path: "/user-results",
      roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    },
    {
      name: "Ходимлар",
      path: "/employees",
      roles: ["ROLE_SUPER_ADMIN"],
    },
    {
      name: "Манзил",
      path: "/addresses",
      roles: ["ROLE_SUPER_ADMIN"],
    },
    {
      name: "Тест",
      path: "/client/test",
      roles: ["ROLE_CLIENT"],
    },
    {
      name: "Натижалар булими",
      path: "/result",
      roles: ["ROLE_CLIENT"],
    }
  ];

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Retrieve the user's role from sessionStorage and check token on component mount
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);

    // const token = sessionStorage.getItem("token");
    // if (!token) navigate("/login");
  }, []);

  return (
    <div>
      <div className="relative ">
        <button className="lg:hidden p-4 text-black" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="font-bold pl-5  text-[30px]">Geadizst</h1>

        <div
          className={`lg:block w-64 text-white fixed inset-0 lg:relative lg:w-64 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300`}
        >
          <div className="lg:hidden w-full text-right">
            <button onClick={toggleSidebar} className="mt-4 mr-4 text-white">
              ✖
            </button>
          </div>

          <ul className="p-4 flex flex-col w-full  gap-y-5 mt-20">
            
            {menuItems
              .filter((item) => item.roles.includes(role || ""))
              .map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`block w-full p-2 text-black rounded border border-gray-600 text-left hover:bg-gray-300 ${
                      location.pathname === item.path ? "bg-gray-200" : ""
                    }`}
                    onClick={toggleSidebar}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
