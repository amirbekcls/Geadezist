import { useEffect, useState } from "react";

const ClientResult: React.FC = () => {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const token = sessionStorage.getItem('token');
      const apiUrl = 'http://142.93.106.195:9090/quiz/pass/60'; // Natijalarni olish uchun API
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Xatolik:', errorData);
          alert(`Xatolik: ${errorData.message}`);
        } else {
          const data = await response.json();
          setResult(data.body); // Natijalarni saqlash
        }
      } catch (error) {
        console.error('Xatolik:', error);
        alert('Natijalarni olishda xatolik yuz berdi.');
      }
    };

    fetchResult();
  }, []);

  if (!result) {
    return <p>Natijalar yuklanmoqda...</p>;
  }

  return (
    <div>
      <h1>Test Natijalari</h1>
      <p>Ism: {result.firstName} {result.lastName}</p>
      <p>Kategoriya: {result.categoryName}</p>
      <p>To'g'ri javoblar: {result.correctAnswer}</p>
      <p>Javoblar soni: {result.countAnswer}</p>
      <p>Test davomiyligi: {result.duration} sekund</p>
      <p>Test balli: {result.testScore}</p>
    </div>
  );
};
export default  ClientResult