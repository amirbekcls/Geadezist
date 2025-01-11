import { Table, Spin, Alert, Input, Modal, Form, Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  // Ma'lumotlarni olish
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Token mavjud emas.');
      setLoading(false);
      return;
    }

    axios
      .get("http://142.93.106.195:9090/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data?.body?.body || [];
        setUsers(data.map((user: any) => ({ ...user, key: user.id })));
        setFilteredUsers(data.map((user: any) => ({ ...user, key: user.id })));
      })
      .catch((err) => {
        console.error("Xato:", err);
        setError('Ma’lumotlarni olishda xatolik yuz berdi.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrni boshqarish
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  // Filtrlash
  const filteredData = () => {
    const { id, firstName, lastName, email } = filters;
    return users.filter((user) => {
      return (
        (id ? user.id.toString().includes(id) : true) &&
        (firstName ? user.firstName.toLowerCase().includes(firstName.toLowerCase()) : true) &&
        (lastName ? user.lastName.toLowerCase().includes(lastName.toLowerCase()) : true) &&
        (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true)
      );
    });
  };

  // Foydalanuvchini o'chiris

  // Foydalanuvchini qo‘shish yoki tahrirlangan foydalanuvchini yangilash
  const AddUsers = async () => {
    if (!editFormData?.id) return;
    try {
      await axios.put(`http://142.93.106.195:9090/user/${editFormData.id}`, editFormData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editFormData.id ? { ...user, ...editFormData } : user
        )
      );
      setEditModal(false);
    } catch (e: any) {
      console.error('Foydalanuvchini yangilashda xatolik:', e);
    }
  };

  // Ustunlar
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: 'Ismi',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Familiyasi',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    
  ];

  return (
    <div>
      {error && <Alert message="Xatolik" description={error} type="error" showIcon />}
      <div style={{ marginBottom: 20 }}>
        <Input
          placeholder="ID bo‘yicha qidirish"
          value={filters.id}
          onChange={(e) => handleFilterChange(e, 'id')}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          placeholder="Ism bo‘yicha qidirish"
          value={filters.firstName}
          onChange={(e) => handleFilterChange(e, 'firstName')}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          placeholder="Familiya bo‘yicha qidirish"
          value={filters.lastName}
          onChange={(e) => handleFilterChange(e, 'lastName')}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          placeholder="Email bo‘yicha qidirish"
          value={filters.email}
          onChange={(e) => handleFilterChange(e, 'email')}
          style={{ width: 200 }}
        />
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={filteredData()}
          columns={columns}
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: error || 'Ma’lumot yo‘q.' }}
          bordered
        />
      </Spin>

      {/* Tahrir Modal */}
      <Modal
        title="Foydalanuvchini tahrirlash"
        visible={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Ism">
            <Input
              value={editFormData?.firstName}
              onChange={(e) =>
                setEditFormData((prev: any) => ({ ...prev, firstName: e.target.value }))
              }
            />
          </Form.Item>
          <Form.Item label="Familiya">
            <Input
              value={editFormData?.lastName}
              onChange={(e) =>
                setEditFormData((prev: any) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={editFormData?.email}
              onChange={(e) =>
                setEditFormData((prev: any) => ({ ...prev, email: e.target.value }))
              }
            />
          </Form.Item>
          <Button type="primary" onClick={AddUsers}>
            Saqlash
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
