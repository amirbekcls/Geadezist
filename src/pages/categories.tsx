import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, Switch } from "antd";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";

const API_BASE_URL = "http://142.93.106.195:9090/category";

// Utility function to get the token from sessionStorage
const getAuthToken = () => {
  return sessionStorage.getItem("token"); // Retrieve token from sessionStorage
};

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]); // Kategoriya ma'lumotlari
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal holati
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState<any | null>(null); // Tahrirlanayotgan kategoriya

  // Kategoriyalarni olish
  const fetchCategories = async () => {
    try {
      const token = getAuthToken(); // Get the token from sessionStorage
      const response = await axios.get(`${API_BASE_URL}/list`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the request headers
        },
      });
      setCategories(response.data.body || []);
    } catch (error) {
      console.error("Kategoriyalarni olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Kategoriya qo'shish yoki yangilash
  const handleFormSubmit = async (values: any) => {
    try {
      const token = getAuthToken(); // Get the token from sessionStorage

      // Agar yangi kategoriya qo'shyapsiz va 'main' true bo'lsa,
      // avvalgi kategoriya bitta bo'lishi kerakligini tekshiramiz.
      if (values.main) {
        const hasMainCategory = categories.some((category) => category.main === true);

        if (hasMainCategory) {
          // Faqat bitta "main" kategoriya bo'lishi kerak.
          alert("Faqat bitta asosiy kategoriya bo'lishi mumkin.");
          return;
        }
      }

      // Backend uchun barcha maydonlarni tayyorlash
      const transformedValues = {
        ...values,
        main: values.main || false, // agar `main` true bo'lsa, faqat bitta kategoriya bo'ladi
        extraQuestionCount: values.extraQuestionCount || 0, // Default qiymat
        durationTime: values.durationTime || 1, // Default qiymat
        retakeDate: values.retakeDate || 0, // Default qiymat
        fileId: values.fileId || 0, // Default qiymat
      };

      // Agar tahrirlayotgan kategoriya mavjud bo'lsa, PUT so'rovini yuborish
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/${editingCategory.id}`, transformedValues, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
      } else {
        // Yangi kategoriya qo'shish
        await axios.post(`${API_BASE_URL}`, transformedValues, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
      }

      form.resetFields();
      setEditingCategory(null);
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  // Kategoriya o'chirish
  const handleDelete = async (id: string) => {
    try {
      const token = getAuthToken(); // Get the token from sessionStorage
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      fetchCategories();
    } catch (error) {
      console.error("Kategoriya o'chirishda xatolik:", error);
    }
  };

  // Modalni ochish
  const showModal = (category: any = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Jadval ustunlari
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tavsif",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Savollar soni",
      dataIndex: "questionCount",
      key: "questionCount",
    },
    {
      title: "Asosiy",
      dataIndex: "main",
      key: "main",
      filters: [
        { text: "Ha", value: true },
        { text: "Yo'q", value: false },
      ],
      onFilter: (value: any, record: any) => record.main === value,
      render: (main: boolean) => (main ? "Ha" : "Yo'q"),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          <Button type="link" onClick={() => showModal(record)}>
            <MdEdit className="text-black hover:text-yellow-600" />
          </Button>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="link" danger>
              <MdDelete className="text-black hover:text-red-600" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Kategoriyalar</h1>
        <Button type="primary" onClick={() => showModal()}>
          Qo'shish
        </Button>
      </div>
      <Table dataSource={categories} columns={columns} rowKey="id" />

      <Modal
        title={editingCategory ? "Kategoriyani tahrirlash" : "Kategoriya qo'shish"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Kategoriya nomi"
            rules={[{ required: true, message: "Kategoriya nomini kiriting" }]}
          >
            <Input placeholder="Kategoriya nomini kiriting" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: "Kategoriya tavsifini kiriting" }]}
          >
            <Input placeholder="Kategoriya tavsifini kiriting" />
          </Form.Item>
          <Form.Item
            name="questionCount"
            label="Savollar soni"
            rules={[{ required: true, message: "Savollar sonini kiriting" }]}
          >
            <Input type="number" placeholder="Savollar sonini kiriting" />
          </Form.Item>
          <Form.Item
            name="extraQuestionCount"
            label="Qo'shimcha savollar soni"
            rules={[{ required: true, message: "Qo'shimcha savollar sonini kiriting" }]}
          >
            <Input type="number" placeholder="Qo'shimcha savollar sonini kiriting" />
          </Form.Item>
          <Form.Item
            name="durationTime"
            label="Davomiylik vaqti"
            rules={[{ required: true, message: "Davomiylik vaqtini kiriting" }]}
          >
            <Input type="number" placeholder="Davomiylik vaqtini kiriting" />
          </Form.Item>
          <Form.Item
            name="retakeDate"
            label="Takrorlash sanasi"
            rules={[{ required: true, message: "Takrorlash sanasini kiriting" }]}
          >
            <Input type="number" placeholder="Takrorlash sanasini kiriting" />
          </Form.Item>
          <Form.Item
            name="fileId"
            label="Fayl ID"
            rules={[{ required: true, message: "Fayl ID sini kiriting" }]}
          >
            <Input type="number" placeholder="Fayl ID sini kiriting" />
          </Form.Item>
          <Form.Item name="main" label="Asosiy kategoriya" valuePropName="checked">
            <Switch />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button onClick={() => setIsModalVisible(false)}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
