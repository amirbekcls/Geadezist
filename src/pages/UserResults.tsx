import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Select, notification } from "antd";
import { UserOutlined } from '@ant-design/icons';

const BASE_URL = "http://142.93.106.195:9090";

// Define the type for user data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  street: string;
  status: string;
}

const UserResults: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Qidiruv inputi
  const [category, setCategory] = useState<string>(""); // Kategoriyani tanlash
  const [status, setStatus] = useState<string>(""); // Statusni tanlash

  // Retrieve token (for example from localStorage)
  const token = sessionStorage.getItem('token');

  // Fetch all users
  const fetchUsers = async () => {
    console.log("Fetching users...");
  
    try {
      setLoading(true);
      const params = {
        firstName: searchTerm,
        lastName: searchTerm,
        category,
        status,
      };
  
      // Log the token to ensure it's being set correctly
      console.log("Token:", token);
  
      const response = await axios.get(`http://142.93.106.195:9090/user`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
    if (response.status !== 200) {
        notification.error({
          message: "Xatolik",
          description: `Server xatosi: ${response.status}`,
        });
      }
      // Log the response status and body to inspect it
      console.log("Response Status:", response);
      console.log("Response Data:", response.data.body);
    
      
      if (response.status === 200 && response.data && response.data.body && response.data.body.body) {
        setUsers(response.data.body.body);
      } else {
        console.error("Unexpected response structure:", response.data);
        notification.error({
          message: "Xatolik",
          description: "Foydalanuvchilarni olishda xatolik yuz berdi.",
        });
      }
  
    } catch (error) {
      console.error("Failed to fetch users:", error); // Log the error if API fails
      notification.error({
        message: "Ma'lumotlarni yuklashda xatolik",
        description: "Foydalanuvchilarni yuklashda xatolik yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    console.log("Component mounted. Fetching users..."); // Log to check if useEffect is being triggered
    fetchUsers();
  }, []);
  

  // Handle user update
  const handleUpdate = (user: User) => {
    const updatedData = {
      ...user,
      firstName: prompt("Yangi Ism:", user.firstName) || user.firstName,
      lastName: prompt("Yangi Familya:", user.lastName) || user.lastName,
      phoneNumber: prompt("Yangi Telefon:", user.phoneNumber) || user.phoneNumber,
      dateOfBirth: prompt("Yangi Tug'ilgan sana (yyyy-mm-dd):", user.dateOfBirth) || user.dateOfBirth,
      street: prompt("Yangi Manzil:", user.street) || user.street,
    };

    updateUser(user.id, updatedData);
  };

  // Update a user
  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      // Set token in Authorization header
      await axios.put(`${BASE_URL}/user-controller/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      notification.success({
        message: "Foydalanuvchi muvaffaqiyatli yangilandi",
      });
      fetchUsers(); // Reload users after update
    } catch (error) {
      console.error("Failed to update user:", error);
      notification.error({
        message: "Foydalanuvchini yangilashda xatolik yuz berdi",
      });
    }
  };

  const columns = [
    {
      title: 'T/P',
      dataIndex: 'key',
      key: 'key',
      render: (text: any, record: User, index: number) => index + 1,
    },
    {
      title: 'Tuliq Ismi',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: any, record: User) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Telefon',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Tug\'ilgan sana',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Manzil',
      dataIndex: 'street',
      key: 'street',
    },
    {
      title: 'Xarakat',
      key: 'action',
      render: (text: any, record: User) => (
        <Button type="primary" onClick={() => handleUpdate(record)}>
          Tahrirlash
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-start mb-20 text-4xl">Foydalanuvchilar natijasi</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          prefix={<UserOutlined />}
          placeholder="🔍Ism yoki familya bo'yicha qidirish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: "1", marginRight: "10px" }}
        />

        <Select
          value={category}
          onChange={(value) => setCategory(value)}
          style={{ flex: "1", marginRight: "10px" }}
          placeholder="Kategoriyani tanlang"
        >
          <Select.Option value="">Kategoriyani tanlang</Select.Option>
          <Select.Option value="category1">Category 1</Select.Option>
          <Select.Option value="category2">Category 2</Select.Option>
        </Select>

        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          style={{ flex: "1" }}
          placeholder="Statusni tanlang"
        >
          <Select.Option value="">Statusni tanlang</Select.Option>
          <Select.Option value="pending">Kutilmoqda</Select.Option>
          <Select.Option value="verified">Tekshirilganlar</Select.Option>
          <Select.Option value="canceled">Bekor qilinganlar</Select.Option>
        </Select>

        <Button
          type="primary"
          onClick={fetchUsers}
          style={{ marginLeft: "10px", height: "40px" }}
        >
          Qidirish
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default UserResults;
