import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuthStore } from "../store/authStore"; // import the auth store
import axios from "axios";
import loginImg from '../../public/login.png'

function Login() {
  const navigate = useNavigate();

  // Using zustand store
  const {
    email,
    password,
    error,
    emailError,
    isLoading,
    setEmail,
    setPassword,
    setError,
    setEmailError,
    setIsLoading,
  } = useAuthStore();

  const handleRegisterNavigation = () => {
    navigate("/register");
  };

  const handleSubmit = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
      setEmailError("Iltimos, to'g'ri email manzilini kiriting.");
      return;
    } else {
      setEmailError("");
    }

    if (password.length < 6 || password.length > 16) {
      setError("Parol 6 tadan kam va 16 tadan ko'p bo'lmasin.");
      return;
    } else {
      setError("");
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://142.93.106.195:9090/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.token && response.data.role) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);

        toast.success("Siz muvaffaqiyatli tizimga kirdingiz!", {
          position: "top-center",
          autoClose: 2000,
        });

        // Directly navigate based on the role
        const role = response.data.role;
        if (role === "ROLE_SUPER_ADMIN") navigate("/dashboard");
        else if (role === "ROLE_TESTER") navigate("/tester-dashboard");
        else if (role === "ROLE_ADMIN") navigate("/admin-dashboard");
        else if (role === "ROLE_CLIENT") navigate("/result");
        else navigate("/login");
      } else {
        setError("Email yoki parol noto'g'ri.");
      }
    } catch (error) {
      console.error(error);
      setError("Tizimda xatolik yuz berdi, iltimos qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLoginButtonDisabled =
    !(email && password) || !!error || !!emailError || isLoading;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        padding: 0,
        margin: 0,
      }}
    >
    <div className="">
      <img src={loginImg} alt="Login Rasmi" />
    </div>
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          padding: "30px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Тизимга кириш
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ fontSize: "16px" }}>
            Електрон почта
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginTop: "5px",
              border: emailError ? "2px solid red" : "1px solid #ccc",
            }}
          />
          {emailError && (
            <small style={{ color: "red", fontSize: "12px" }}>
              {emailError}
            </small>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ fontSize: "16px" }}>
            Парол
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginTop: "5px",
              border: error ? "2px solid red" : "1px solid #ccc",
            }}
          />
          {error && (
            <small style={{ color: "red", fontSize: "12px" }}>{error}</small>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoginButtonDisabled}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isLoginButtonDisabled ? "not-allowed" : "pointer",
          }}
          className="bg-blue-600 hover:bg-blue-700 font-bold"
        >
          {isLoading ? "Kirish..." : "Тизимга кириш"}
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleRegisterNavigation}
            style={{
              fontSize: "12px",
              color: "#5213e7",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Рўйхатдан ўтиш
          </button>
          <button
            onClick={() => navigate("/changepass")}
            style={{
              fontSize: "12px",
              color: "#5213e7",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Паролни унутдингизми?
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
