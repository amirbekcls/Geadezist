import React, { useEffect, useState } from 'react';
import { Select, Pagination, Card, Row, Col, Typography, Table } from 'antd';
import { BiCategory } from 'react-icons/bi';
import { FaCircleQuestion } from 'react-icons/fa6';
import { PiArrowsOutCardinal } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { DashboardAllStc } from '../api/api';
import WeeklyStatsChart from './Chart';

const { Option } = Select;
const { Title } = Typography;

// Define the user type
interface User {
  firstName: string;
  lastName: string;
  correctAnswers: number;
  categoryName: string;
  regionID: number;  // Added regionID to user type
}

interface AllStatc {
  categoryCount: number;
  questionCount: number;
  resultCount: number;
  userCount: number;
}

const Dashboard: React.FC = () => {
  const [categoryID, setCategoryID] = useState(null);
  const [regionID, setRegionID] = useState(null);
  const [totalPage, setTotalPage] = useState(10);
  const [data, setData] = useState<User[] | null>(null);
  const [allStatc, setAllStatc] = useState<AllStatc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching user results from API
  useEffect(() => {
    const apiUrl = "http://142.93.106.195:9090/statistic/filter/";

    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Build the query params dynamically based on categoryID and regionID
        const params: any = {};
        if (categoryID) params.categoryID = categoryID;
        if (regionID) params.regionID = regionID;

        const response = await axios.get(apiUrl, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params, // Add filters as query parameters
        });

        setData(response.data.body.body);

        const dresponse = await axios.get(DashboardAllStc, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAllStatc(dresponse.data.body);
        console.log(dresponse.data.body);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryID, regionID]); // Re-fetch data when categoryID or regionID changes

  // Card data
  const cardData = [
    { title: 'Умумий категория', total: allStatc?.categoryCount || 0, icon: <BiCategory className="text-2xl ml-5" /> },
    { title: 'Умумий савол', total: allStatc?.questionCount || 0, icon: <FaCircleQuestion className="text-2xl ml-5" /> },
    { title: 'Умумий натижа', total: allStatc?.resultCount || 0, icon: <PiArrowsOutCardinal className="text-2xl ml-5" /> },
    { title: 'Жами фойдаланувчилар', total: allStatc?.userCount || 0, icon: <FaUsers className="text-2xl ml-5" /> },
  ];

  // Table columns
  const columns = [
    { title: 'Т/Р', dataIndex: 'key', key: 'key' },
    { title: 'Исм', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Фамилия', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Категория номи', dataIndex: 'categoryName', key: 'categoryName' },
    { title: 'Натижа (Тўғри жавоблар/Умумий саволлар)', dataIndex: 'correctAnswers', key: 'correctAnswers' },
  ];

  // Get unique categories from data
  const uniqueCategories = Array.from(new Set(data?.map(item => item.categoryName) || []));
  
  // Filtered data based on categoryID and regionID
  const filteredData = data?.filter(item => {
    const matchesCategory = categoryID ? item.categoryName === categoryID : true;
    const matchesRegion = regionID ? item.regionID === regionID : true;
    return matchesCategory && matchesRegion;
  });

  return (
    <>
      <Row gutter={[16, 16]}>
        {cardData.map((card, index) => (
          <Col span={6} key={index}>
            <Card
              title={card.title}
              extra={card.icon}
              bordered={false}
              className="flex justify-between items-center"
            >
              <Title level={4}>{card.total}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4">
        <Title level={3}>Chart Joyi </Title>
        <WeeklyStatsChart />
      </div>

      <div className="mt-10">
        <Row gutter={[16, 16]} className="mb-4">
          <Col span={12}>
            <Select
              placeholder="Категорияни танланг"
              value={categoryID}
              style={{ width: '100%' }}
              onChange={(value) => setCategoryID(value)}
              allowClear
            >
              {uniqueCategories.map((category, index) => (
                <Option key={index} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Select
              placeholder="Вилоятни танланг"
              value={regionID}
              style={{ width: '100%' }}
              onChange={(value) => setRegionID(value)}
              allowClear
            >
              <Option value="1">Region 1</Option>
              <Option value="2">Region 2</Option>
            </Select>
          </Col>
        </Row>

        {/* Table for User Results */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {filteredData && (
          <Table
            columns={columns}
            dataSource={filteredData.map((user, index) => ({
              key: index + 1,
              firstName: user.firstName,
              lastName: user.lastName,
              categoryName: user.categoryName,
              correctAnswers: `${user.correctAnswers}/20`,
            }))}
            pagination={false}
            bordered
          />
        )}

        <Pagination
          showSizeChanger={false}
          responsive
          defaultCurrent={1}
          total={totalPage}
          onChange={(page) => setTotalPage(page)}
          className="mt-10 mb-5"
        />
      </div>
    </>
  );
};

export default Dashboard;
