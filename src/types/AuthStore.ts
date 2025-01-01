export interface AuthStore {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    role: string;
    confirmPassword: string;
    token: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string;
    emailError: string; 
    resData: any | null
  
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setFirstname: (firstname: string) => void;
    setLastname: (lastname: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setRole: (role: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    setToken: (token: string) => void;
    setIsLoggedIn: (status: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setEmailError: (error: string) => void;
    setResData: (data: any) => void; 
  }


