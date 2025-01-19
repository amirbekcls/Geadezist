import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import { AdminResult } from '../types/AdminResul';
import GlobalModal from '../components/Modal/Modal';

interface Arxiv {
  question: string;
  categoryName: string;
  difficulty: string;
  answer: string[];
  correctAnswer: string | null;
  correct: boolean;
}

interface Natija {
  firstName: string;
  lastName: string;
  categoryName: string;
  correctAnswers: number;
  countAnswers: number; // Likely a typo, should be countAnswers
  testScore: number;
  status: string;
  durationTime: number,
  createdAt: string;
  extraResDtoList: {
    categoryName: string;
    correctAnswer: number;
    countAnswer: number;
  }[];
}




const ClientResult = () => {
  const [data, setData] = useState<AdminResult[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredData, setFilteredData] = useState<AdminResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [arxiv, setArxiv] = useState<Arxiv[] | null>(null);
  const [natiija, setNatija] = useState<Natija | null>(null)

  useEffect(() => {
    const FetchData = async () => {
      let token = sessionStorage.getItem('token');

      try {
        const response = await axios.get(
          `http://142.93.106.195:9090/result/results/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.body && response.data.body.body) {
          setData(response.data.body.body);
          setTotalPages(response.data.body.totalPage);
        } else {
          setData([]);
        }
      } catch (e) {
        console.log('Xato:', e);
      }
    };

    FetchData();
  }, [page]);
  useEffect(() => {
    let filtered = data;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.categoryName === selectedCategory
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredData(filtered);
  }, [data, searchQuery, selectedCategory, selectedStatus]);
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

  const handleResubmit = async (userId: string, categoryId: string) => {
    let token = sessionStorage.getItem('token');

    if (!token) {
      alert('Token not found');
      return;
    }

    try {
      const response = await axios.put(
        `http://142.93.106.195:9090/result/update/expiredDate?userId=${userId}&categoryId=${categoryId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('Request successful');
      }
    } catch (error: any) {
      console.error('Error during request:', error.response ? error.response.data : error);
      alert('Request failed');
    }
  };

  const ExpireDateFunc = (expireDate: number) => {
    const currentDate = new Date();
    const expireDatee = new Date(expireDate);
    if (expireDatee < currentDate) {
      return 'Qayta topshirsh mumkin';
    } else {
      return 'Test Topshirsh nuddati otgan';
    }
  };

  const Status = async (status: string, id: number) => {
    let token = sessionStorage.getItem('token');
    if (!token) {
      alert('Token yuq');
      return;
    }
    try {
      const response = await axios.put(
        `http://142.93.106.195:9090/result/update-status/${id}?status=${status}&practicalScore=0`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('Status updated successfully');
        return;
      }
    } catch (error: any) {
      console.log('Error status');
    }
  };

  // Fetch archive data for a specific user when clicked
  const FetchDataArxiv = async (id: number) => {
    let token = sessionStorage.getItem('token');
    if (!token) {
      alert('Token yuq');
      return;
    }
    try {
      const response = await axios.get(
        `http://142.93.106.195:9090/result/resultByArchive/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Fetching data for id:', id);

      // Update this part to access the correct structure
      if (response.data && response.data.body) {
        setArxiv(response.data.body); // Directly set the body array
        console.log('arxiv', response.data.body);
      } else {
        console.log('No archive data found');
        // Set to empty array if no data is found
      }
    } catch (e: any) {
      console.log('Error fetching archive data:', e);
    }
  };

  const FetchNatijaData = async (id: number) => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('token yuq')
      return
    }
    try {
      const response = await axios.get(`http://142.93.106.195:9090/result/get-one/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response.data);

      if (response.data && response.data.body) {


        setNatija(response.data.body)
        console.log('Natija holatiga o', response.data.body)

      } else (
        console.log('malimot topilmadi')
      )
    } catch (e: any) {
      console.error('Маълумот олишда хатолик:', e.response ? e.response.data : e.message);
    }
  }
  const uniqueCategories = [
    ...new Set(filteredData.map((item) => item.categoryName)),
  ];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Фойдаланувчилар натижаси</h1>
        <div className="text-gray-500">Бошқарув панели / Фойдаланувчилар натижаси</div>
      </div>

      <div className="flex gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Ф.И.О қидириш..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category dropdown */}
        <div className="relative w-[300px]">
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Категорияни танланг</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative w-[300px]">
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Статусни танланг</option>
            <option value="APPROVED">Tastiqlandi</option>
            <option value="CANCELLED">Bekor qilindi</option>
            <option value="WAITING">Kutilmoqda</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Т/Р</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Тўлиқ исм</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Категория</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Телефон</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Қайта тест топш...</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Статус</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ҳаракат</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.categoryName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{ExpireDateFunc(item.expiredDate)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full text-white
                      ${item.status === 'APPROVED'
                        ? 'bg-green-700'
                        : item.status === "CANCELLED"
                          ? 'bg-red-700'
                          : 'bg-yellow-700'
                      }
                    `}>
                    {item.status === "APPROVED"
                      ? 'Tastiqlandi'
                      : item.status === "CANCELLED"
                        ? 'Bekor qilindi'
                        : 'Kutilmoqda'}
                  </span>
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === item.id ? null : item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {showDropdown === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button onClick={() => Status('APPROVED', item.id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Tastiqlsh
                      </button>
                      <button
                        onClick={() => {
                          FetchDataArxiv(item.id); // Fetch archive for the selected user
                          setIsModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Архивини кўриш
                      </button>
                      <button onClick={() => {
                        FetchNatijaData(item.id)
                        setIsModalOpen(true);
                      }
                      } className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Натижани кўриш
                      </button>

                      <button onClick={() => Status('CANCELLED', item.id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Бекор қилиш
                      </button>
                      <button
                        onClick={() => handleResubmit(item.userId.toString(), item.categoryId.toString())}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Қайта топширишга рухсат бериш
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-1">
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          &#8249;
        </button>

        <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600">
          1
        </button>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages - 1}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          &#8250;
        </button>
      </div>
      <GlobalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          {arxiv && arxiv.length > 0 ? (
            arxiv.map((item, index) => (
              <div key={index} className="py-2">
                <p>{`Question: ${item.question}`}</p>
                <p>{`Category: ${item.categoryName}`}</p>
                <p>{`Answer: ${item.answer.join(', ')}`}</p>
                <p>{`Difficulty: ${item.difficulty}`}</p>
                <p>{`Correct: ${item.correct ? 'Yes' : 'No'}`}</p>
              </div>
            ))
          ) : (
            <div>
              {natiija ? (
                <div className="py-4">
                  <p>{`Tuliq ismi: ${natiija.lastName} ${natiija.lastName} `}</p>

                  <p>{`Category: ${natiija.categoryName}`}</p>
                  {`Natija (javoblar/savollar): `}
                  <span className="text-green-500">{natiija.correctAnswers}</span>
                  {` / ${natiija.countAnswers}`}
                  <p>{`ishlash davomiyligi: ${natiija.durationTime} (sek)`}</p>
                  <p>{`Ishlash Sanasi: ${natiija.createdAt}`}</p>
                </div>
              ) : (
                <p>Маълумот мавжуд эмас.</p>
              )}
            </div>
          )}
        </div>
      </GlobalModal>


    </div>
  );
};

export default ClientResult;
