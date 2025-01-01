import { Table, Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import GlobalModal from "../components/Modal/Modal";
import '../index.css'

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
}

function Employees() {
  const [employs, setEmploys] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const token = sessionStorage.getItem("token");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Исми",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Фамилияси",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Электрон почта",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Рол",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Фаолми?",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled: boolean) => (enabled ? "Ҳа" : "Йўқ"),
    },
    {
      title: "Ҳаракатлар",
      key: "actions",
      render: (_: any, record: Employee) => (
        <div className="toggle-container">
          <input
            type="checkbox"
            className="toggle-input"
            checked={record.enabled}
            onChange={() => toggleActiveStatus(record.id, !record.enabled)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 292 142" className="toggle">
            <path
              d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
              className="toggle-background"
            ></path>
            <rect
              rx="6"
              height="64"
              width="12"
              y="39"
              x="64"
              className="toggle-icon on"
            ></rect>
            <path
              d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z"
              fillRule="evenodd"
              className="toggle-icon off"
            ></path>
            <g filter="url('#goo')">
              <rect
                fill="#fff"
                rx="29"
                height="58"
                width="116"
                y="42"
                x="13"
                className="toggle-circle-center"
              ></rect>
              <rect
                fill="#fff"
                rx="58"
                height="114"
                width="114"
                y="14"
                x="14"
                className="toggle-circle left"
              ></rect>
              <rect
                fill="#fff"
                rx="58"
                height="114"
                width="114"
                y="14"
                x="164"
                className="toggle-circle right"
              ></rect>
            </g>
            <filter id="goo">
              <feGaussianBlur stdDeviation="10" result="blur" in="SourceGraphic"></feGaussianBlur>
              <feColorMatrix
                result="goo"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                mode="matrix"
                in="blur"
              ></feColorMatrix>
            </filter>
          </svg>
        </div>
      )
      
    },
  ];

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const response = await axios.get(
          "http://142.93.106.195:9090/user/get/admin/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmploys(response.data.body.body);
      } catch (error) {
        console.error("Ма'lumotни олишда хато:", error);
      }
    };
    dataFetch();
  }, [token]);

  const toggleActiveStatus = async (userId: string, checked: boolean) => {
    try {
      await axios.put(
        `http://142.93.106.195:9090/user/active/${userId}`,
        { enabled: checked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmploys((prevEmploys) =>
        prevEmploys.map((employee) =>
          employee.id === userId
            ? { ...employee, enabled: checked }
            : employee
        )
      );
    } catch (error) {
      console.error("Enabled холатини ўзгартиришда хато:", error);
    }
  };

  const addEmployee = async (values: any) => {
    try {
      await axios.post(
        "http://142.93.106.195:9090/auth/save/admin",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalOpen(false);
      form.resetFields();
      const response = await axios.get(
        "http://142.93.106.195:9090/user/get/admin/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmploys(response.data.body.body);
    } catch (error) {
      console.error("Ходим қўшишда хато:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Ходимлар</h1>

      <button
        // type="default"
        onClick={() => setIsModalOpen(true)}
        className="mb-4 py-2 px-5 rounded-md font-bold bg-gray-500 hover:bg-gray-700 text-white"
      >
         Кўшиш
      </button>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={employs}
        pagination={false}
      />

      <GlobalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl mb-4">Ходим қўшиш</h2>
        <Form form={form} layout="vertical" onFinish={addEmployee}>
          <Form.Item
            name="firstName"
            label="Исми"
            rules={[{ required: true, message: "Исмни киритинг" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Фамилияси"
            rules={[{ required: true, message: "Фамилияни киритинг" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электрон почта"
            rules={[{ required: true, type: "email", message: "Тўғри email киритинг" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Телефон рақам"
            rules={[{ required: true, message: "Телефон рақамни киритинг" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Парол"
            rules={[{ required: true, message: "Паролни киритинг" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Паролни тасдиқлаш"
            rules={[{ required: true, message: "Паролни тасдиқланг" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Роле"
            rules={[{ required: true, message: "Ролени танланг" }]}
          >
            <Select >
              <Select.Option value="ROLE_TESTER">Тестер админ</Select.Option>
              <Select.Option value="ROLE_ADMIN">Админ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gray-500 hover:bg-gray-700 text-white"
            >
              Сақлаш
            </Button>
          </Form.Item>
        </Form>
      </GlobalModal>
    </div>
  );
}

export default Employees;
