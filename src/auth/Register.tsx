import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "ROLE_USER",
  });

  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [allowAll, setAllowAll] = useState<boolean>(false);
  const [, setOpenModal] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [genderError, setGenderError] = useState<string>("");

  const handleChange = (label: string, value: string) => {
    setValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleGenderChange = (value: "MALE" | "FEMALE") => {
    setGender(value);
    setGenderError(""); // Clear error on selection
  };

  const handleAllowAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowAll(event.target.checked);
    if (event.target.checked) {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Email validation
    const trimmedEmail = values.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (values.password !== values.confirmPassword) {
      setPasswordError("Passwords do not match.");
      isValid = false;
    } else if (values.password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Gender validation
    if (!gender) {
      setGenderError("Please select a gender.");
      isValid = false;
    } else {
      setGenderError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `http://142.93.106.195:9090/auth/register?genderType=${gender}`,
        {
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          confirmPassword: values.confirmPassword,

          role: values.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!", { position: "top-center" });
        const { token, role } = response.data;
        if (token && role) {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userRole", role);
        }
        navigate("/verfy-code");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`, { position: "top-center" });
      } else {
        toast.error("Network error occurred. Please try again later.", { position: "top-center" });
      }
    }
  };

  const isSubmitButtonDisabled =
    !(values.email && values.password && values.firstname && values.lastname && gender && allowAll) ||
    !!emailError ||
    !!passwordError ||
    !!genderError;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => handleGenderChange("MALE")}
            className={`w-1/2 py-3 rounded-md text-lg ${
              gender === "MALE" ? "bg-blue-500 text-white" : "bg-transparent border border-blue-500 text-blue-500"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => handleGenderChange("FEMALE")}
            className={`w-1/2 py-3 rounded-md text-lg ${
              gender === "FEMALE" ? "bg-blue-500 text-white" : "bg-transparent border border-blue-500 text-blue-500"
            }`}
          >
            Female
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={values.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Last Name"
            value={values.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
        </div>

        <div className="mb-4">
          <input
            type="tel"
            placeholder="Phone"
            value={values.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="allowAll"
            checked={allowAll}
            onChange={handleAllowAllChange}
            className="mr-2"
          />
          <label htmlFor="allowAll" className="text-sm">
            I agree to allow all
          </label>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-1/2 py-3 bg-transparent border border-blue-500 text-blue-500 rounded-md hover:bg-gray-100"
          >
            Go to Login
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitButtonDisabled}
            className={`w-1/2 py-3 text-white rounded-md ${isSubmitButtonDisabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            Register
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;
