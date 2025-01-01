import { useState } from "react";
import { notification, Spin } from "antd";  // Ant Design notification
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      notification.error({
        message: "Error",
        description: "Iltimos, emailni kiriting.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put("http://142.93.106.195:9090/auth/forgot-password", { email });

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Kod yuborildi, iltimos emailni tekshirib ko'ring.",
        });
        navigate(`/reset-password?email=${email}`);
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: "Email manzilingiz bilan hisob topilmadi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleSendCode}
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? <Spin /> : "Send Code"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
