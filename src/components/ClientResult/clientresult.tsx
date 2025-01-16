import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResultType } from '../../types/CLientResult';

function ClientResult() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Sahifa 0-dan boshlanadi
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const FetchData = async () => {
      let token = sessionStorage.getItem('token');

      try {
        const response = await axios.get(
          `http://142.93.106.195:9090/statistic/user-dashboard/?page=${page}&size=3`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.body && response.data.body.body) {
          setData(response.data.body.body); // Ma'lumotlarni o'rnatish
          setTotalPages(response.data.body.totalPage); // Jami sahifalarni o'rnatish
        } else {
          setData([]); // Bo'sh massiv
        }
      } catch (e) {
        console.log('Xato:', e);
      }
    };

    FetchData();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  // Ranglarni inline-style orqali belgilash
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'WAITING':
        return { backgroundColor: '#FFEB3B', color: '#000' }; // Sariq fon, qora matn
      case 'APPROVED':
        return { backgroundColor: '#4CAF50', color: '#FFF' }; // Yashil fon, oq matn
      case 'CANCELLED':
        return { backgroundColor: '#F44336', color: '#FFF' }; // Qizil fon, oq matn
      default:
        return { backgroundColor: '#9E9E9E', color: '#FFF' }; // Kulrang fon, oq matn
    }
  };

  return (
    <div>
      <div className="flex ">
        {data && data.length > 0 ? (
          data.map((item: ResultType) => (
            <div
              key={item.id}
              className="w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg p-6 m-4"
            >
              <h3 className="text-xl font-semibold mb-4">
                {item.firstName} {item.lastName}
              </h3>
              <p className="text-sm text-gray-600">ID: {item.id}</p>
              <p className="text-sm text-gray-600">
                Category: {item.categoryName || 'not found'}
              </p>
              <p className="text-sm text-gray-600">
                Correct Answers: {item.correctAnswers}
              </p>
              <p className="text-sm text-gray-600">
                Count Answers: {item.countAnswers}
              </p>
              <p className="text-sm text-gray-600">Duration: {item.durationTime}</p>
              <p className="text-sm text-gray-600">
                Status:{' '}
                <span
                  style={{
                    ...getStatusStyle(item.status),
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {item.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">Test Score: {item.testScore}</p>
            </div>
          ))
        ) : (
          <p>Ma'lumot yo'q</p>
        )}
      </div>

      {/* Qo'lda sahifalash */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          className={`px-4 py-2 rounded-lg ${
            page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages - 1}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ClientResult;
