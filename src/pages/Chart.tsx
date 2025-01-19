import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/charts";
import axios from "axios";

const WeeklyStatsChart: React.FC = () => {
  const [data, setData] = useState<{ dayOfWeek: number; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "http://142.93.106.195:9090/statistic/dayOfWeek/";
      const token = sessionStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data.body) {
          // Haftalik kunlarni nomlar bilan almashtirish
          const formattedData = response.data.body.map((item: any) => ({
            day: [
              "Dushanba",
              "Seshanba",
              "Chorshanba",
              "Payshanba",
              "Juma",
              "Shanba",
              "Yakshanba",
            ][item.dayOfWeek - 1], // Haftaning kunini nomga aylantirish
            count: item.count,
          }));

          setData(formattedData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart konfiguratsiyasi
  const config = {
    data,
    xField: "day",
    yField: "count",
    color: "#1890ff",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      day: { alias: "Kun" },
      count: { alias: "Son" },
    },
  };

  return (
    <div>
      {loading && <p>Loading</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && <Bar {...config} />}
    </div>
  );
};

export default WeeklyStatsChart;
