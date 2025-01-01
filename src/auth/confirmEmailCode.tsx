import { useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function VerifyCode() {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Code input o'zgarishini boshqarish
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCode = e.target.value;

    // Faqat 5 raqamli kodni qabul qilish
    if (inputCode.length <= 5) {
      setCode(inputCode);
    }

    // Xatolikni tozalash
    if (inputCode.length === 5) {
      setError(""); // Kod 5 ta raqamga yetganida xatolikni tozalash
    }
  }, []);

  // Kodni tekshirish
  const handleVerifyCode = useCallback(async () => {
    if (code.length !== 5) {
      setError("Please enter the 5-digit verification code.");
      return;
    }

    try {
      const response = await axios.put(
        `http://142.93.106.195:9090/auth/activate?code=${code}`,
        ""
      );

      if (response.data.success) {
        toast.success("Code verified successfully!");
        window.location.href = `/reset-password?token=${response.data.token}`;
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying code. Please try again later.");
      console.error("Verification error:", error);
    }
  }, [code]);

  // Verify button'ni faollashtirish yoki o'chirish
  const isButtonDisabled = code.length !== 5 || error !== "";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-4">Enter Verification Code</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the 5-digit verification code sent to your email.
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={handleInputChange}
            maxLength={5} // Inputning uzunligini 5 ta raqam bilan cheklash
            className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <button
          onClick={handleVerifyCode}
          className={`w-full py-3 text-white rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isButtonDisabled}
        >
          Verify Code
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default VerifyCode;
