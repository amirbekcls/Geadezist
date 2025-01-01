import { useState, useEffect } from "react";
import { notification, Spin } from "antd"; // Ant Design notification
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setVerificationCode(queryParams.get("code") || "");
  }, [location]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "Parollar mos kelmaydi.",
      });
      return;
    }

    if (!newPassword || !confirmPassword || !verificationCode) {
      notification.error({
        message: "Error",
        description: "Iltimos, barcha maydonlarni to'ldiring.",
      });
      return;
    }

    setIsLoading(true);

    const verificationCodeAsNumber = Number(verificationCode);

    if (isNaN(verificationCodeAsNumber)) {
      notification.error({
        message: "Error",
        description: "Iltimos, to'g'ri tasdiqlash kodini kiriting.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put("http://142.93.106.195:9090/auth/reset-password", {
        passwordToken: verificationCodeAsNumber,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Parol muvaffaqiyatli yangilandi.",
        });
        navigate("/login", { state: { resetSuccess: true } });
      }
    } catch (error: any) {
      console.error("Xatolik:", error);
      notification.error({
        message: "Error",
        description: "Tizimda xatolik yuz berdi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleResetPassword}
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? <Spin /> : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
