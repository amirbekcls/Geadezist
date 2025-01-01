import {create} from "zustand";
import { AuthStore } from "../types/AuthStore";
//  typelani e+types dn olb keganma
export const useAuthStore = create<AuthStore>((set) => ({
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  phoneNumber: "",
  role: "",
  confirmPassword: "",
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: "",
  emailError:"",
  resData:null,

  setEmail: (email) => set(() => ({ email })),
  setPassword: (password) => set(() => ({ password })),
  setFirstname: (firstname) => set(() => ({ firstname })),
  setLastname: (lastname) => set(() => ({ lastname })),
  setPhoneNumber: (phoneNumber) => set(() => ({ phoneNumber })),
  setRole: (role) => set(() => ({ role })),
  setConfirmPassword: (confirmPassword) => set(() => ({ confirmPassword })),
  setToken: (token) => set(() => ({ token })),
  setIsLoggedIn: (status) => set(() => ({ isLoggedIn: status })),
  setIsLoading: (loading) => set(() => ({ isLoading: loading })),
  setError: (error) => set(() => ({ error })),
  setEmailError: (error) => set(() => ({ emailError: error })), 
  setResData: (data) => set(() => ({ resData: data })),
}));


//  bu auth store userlani malumotlarini saqlash uchun kere  va keyin state larni ham kam ishlatsh uchun kerak 
