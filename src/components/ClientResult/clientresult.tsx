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
      <div className="flex m-auto gap-5 justify-center">
        {data && data.length > 0 ? (
          data.map((item: ResultType) => (
            <div
              key={item.id}
              className="w-[400px] border border-black py-5 px-5 "
            >
              <div className="">
                <h3 className="text-xl font-semibold mb-4">
                  {item.firstName} {item.lastName}
                </h3>
                <p className="text-lg font-bold text-red-600 text-center py-2 ">
                  {item.categoryName || 'not found'}
                </p>
                <p className="text-sm text-gray-600">
                  Tugri Javoblar: {item.correctAnswers}/ {item.countAnswers}
                </p>
                <p className="text-sm text-gray-600">Vaqt davomiyligi: {item.durationTime} (daq)</p>
                <p className="text-sm text-gray-600">Toplangan ball: {item.testScore}</p>
                <p className="text-sm text-gray-600">Test topshirsh sana {item.createdAt}</p>
                <div className="w-[200px] pt-10">
                <span style={{...getStatusStyle(item.status),
                  width:'100px',
                  padding:'10px 100px',
                  color:'white'
                  // position:'absolute'
                }}>
                  {item.status}

                </span>
                </div>
              </div>
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
          className={`px-4 py-2 rounded-lg ${page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
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
          className={`px-4 py-2 rounded-lg ${page === totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ClientResult;
