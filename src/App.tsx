import React, { useEffect } from 'react';
import {  Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Register from './auth/Register';
import ForgotPassword from './auth/password/forgetPassword';
import ResetPassword from './auth/password/resetPassword';
import VerifyCode from './auth/confirmEmailCode';
import Login from './auth/Login';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import Categories from './pages/categories';
import UserResults from './pages/UserResults';
import Employees from './pages/Employees';
import Adress from './pages/address/adress';
import AdminLaylaut from './Laylaut/adminLaylaut';
import AddTest from './components/Test/AddTest';
import TestWork from './components/Tests/TestWork';
import Test from './pages/test';
import ClientResult from './components/ClientResult/clientresult';
import ClientTest from './components/ClientTest/clienttest';

// import NotFound from './pages/NotFound';
// import Distric from './pages/Addresses/distric';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = sessionStorage.getItem('role');
  const token = sessionStorage.getItem('token');
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!token && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [token, location.pathname, navigate]);

  const getDefaultRedirectPath = () => {
    switch (role) {
      case 'ROLE_TESTER':
        return '/categories';
      case 'ROLE_ADMIN':
        return '/user-results';
      case 'ROLE_SUPER_ADMIN':
        return '/dashboard';
      case 'ROLE_CLIENT':
        return '/result';
      default:
        return '/login';
    }
  };

  const protectedRoute = (roles: string | string[], component: JSX.Element) => {
    const hasAccess = Array.isArray(roles)
      ? roles.includes(role || '')
      : role === roles;

    return hasAccess ? component : <Navigate to='/login' />;
  };

  return (
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/changepass' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/verify-code' element={<VerifyCode />} />
        {/* <Route path='/*' element={<NotFound />} /> */}

        <Route path='/login' element={role ? <Navigate to={getDefaultRedirectPath()} /> : <Login />} />
        {/* <Route path='/distric' element={<Distric />} /> */}

        <Route path='/' element={role ? <AdminLaylaut /> : <Navigate to='/login' />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='users' element={protectedRoute('ROLE_SUPER_ADMIN', <Users />)} />
          <Route path='categories' element={protectedRoute(['ROLE_TESTER', 'ROLE_SUPER_ADMIN'], <Categories />)} />
          <Route path='test' element={protectedRoute(['ROLE_TESTER', 'ROLE_SUPER_ADMIN'], <Test />)} />
          <Route path='client' element={protectedRoute(['ROLE_CLIENT'], <TestWork />)} />
          <Route path='user-results' element={protectedRoute(['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'], <UserResults />)} />
          <Route path='employees' element={protectedRoute('ROLE_SUPER_ADMIN', <Employees />)} />
          <Route path='result' element={protectedRoute('ROLE_CLIENT', <ClientResult />)} />
          <Route path='addresses' element={protectedRoute('ROLE_SUPER_ADMIN', <Adress />)} />
          <Route path='client/test' element={protectedRoute('ROLE_CLIENT', <ClientTest />)} />
          
        </Route>
      </Routes>
  );
};

export default App;
