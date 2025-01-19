import { useState, useEffect } from 'react';
import { Select, Table, Button } from 'antd';
import { MdDelete, MdEdit, MdOutlineAddCircle } from 'react-icons/md';
import useTestStore from '../../store/testStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const { Option } = Select;

// Option interface
interface OptionDto {
  answer: string;
  isCorrect: boolean;
  file: number;
}

// Test details interface
interface TestDetails {
  id?: string;
  name: string;
  categoryId: string;
  difficulty: string;
  type: string;
  optionDtos: OptionDto[];
}

interface Category {
  id: string | number;
  name: string;
}

const AddTest: React.FC = () => {
  const { testList, setTestList } = useTestStore();
  const [testDetails, setTestDetails] = useState<TestDetails>({
    name: '',
    categoryId: '',
    difficulty: '',
    type: '',
    optionDtos: [{ answer: '', isCorrect: false, file: 0 }],
  });
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');


  const token = sessionStorage.getItem('token');

  // Fetch categories
  useEffect(() => {
    if (token) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('http://142.93.106.195:9090/category/list', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategoryData(response.data.body);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }
  }, [token]);

  // Fetch tests
  useEffect(() => {
    if (token) {
      const fetchTests = async () => {
        try {
          const response = await axios.get('http://142.93.106.195:9090/question/filter', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTestList(response.data?.body?.body || response.data?.body); // Update test list
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      };
      fetchTests();
    }
  }, [token, setTestList]);

  // Handle input change
  const handleChange = (field: keyof TestDetails, value: string | number) => {
    setTestDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Add new option
  const handleAddOption = () => {
    setTestDetails((prevDetails) => ({
      ...prevDetails,
      optionDtos: [
        ...prevDetails.optionDtos,
        { answer: '', isCorrect: false, file: 0 },
      ],
    }));
  };

  // Remove option
  // Function to handle removing an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...testDetails.optionDtos];
    updatedOptions.splice(index, 1); // Remove the option at the specified index
    setTestDetails((prevDetails) => ({
      ...prevDetails,
      optionDtos: updatedOptions,
    }));
  };


  // Handle option change
  const handleOptionChange = (index: number, field: keyof OptionDto, value: string | boolean) => {
    const updatedOptions: any = [...testDetails.optionDtos];
    updatedOptions[index][field] = value as any; // TypeScript satisfaction
    setTestDetails((prevDetails) => ({
      ...prevDetails,
      optionDtos: updatedOptions,
    }));
  };

  // Open modal for adding or editing tests
  const openModal = (test?: TestDetails) => {
    if (test) {
      setTestDetails(test);
      setIsEditing(true);
    } else {
      setTestDetails({
        name: '',
        categoryId: '',
        difficulty: '',
        type: '',
        optionDtos: [{ answer: '', isCorrect: false, file: 0 }],
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Submit test
  const handleSubmit = async () => {
    const { name, categoryId, difficulty, type, optionDtos, id } = testDetails;

    if (!name || !categoryId || !difficulty || !type || optionDtos.length === 0) {
      toast.error('Илтимос, барча майдонларни тўлдиринг');
      return;
    }

    const payload = {
      name,
      categoryId,
      difficulty,
      type,
      attachmentIds: [0],
      optionDtos: optionDtos.map(({ answer, isCorrect }) => ({
        answer,
        isCorrect,
        file: 0,
      })),
    };

    try {
      if (isEditing && id) {
        // Edit test
        const response = await axios.put(`http://142.93.106.195:9090/question/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Тест муваффақиятли тўғриланди!');
        setTestList(
          testList.map((test: any) => (test.id === id ? response.data.body : test))
        );
      } else {
        // Add new test
        const response = await axios.post('http://142.93.106.195:9090/question', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Тест муваффақиятли қўшилди!');
        setTestList([...testList, response.data.body]);
      }
      closeModal();
    } catch (error) {
      console.error('Тестни юборишда хато:', error);
      toast.error('Тестни юборишда хато юз берди');
    }
  };

  // Delete test
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Тестни ўчиришни истайсизми?');
    if (confirmed) {
      try {
        const response = await axios.delete(`http://142.93.106.195:9090/question/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Тест муваффақиятли ўчирилди!');
        setTestList(testList.filter((test: any) => test.id !== id));
      } catch (error) {
        console.error('Тестни ўчиришда хато:', error);
        toast.error('Тестни ўчиришда хато юз берди');
      }
    }
  };
  useEffect(() => {
    if (token) {
      const fetchTests = async () => {
        try {
          const params: any = {};
          if (filterCategory) params.categoryId = filterCategory;
          if (filterDifficulty) params.difficulty = filterDifficulty;
          if (filterType) params.type = filterType;
  
          const response = await axios.get('http://142.93.106.195:9090/question/filter', {
            headers: { Authorization: `Bearer ${token}` },
            params,
          });
          setTestList(response.data?.body?.body || response.data?.body); // Update test list
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      };
      fetchTests();
    }
  }, [token, setTestList, filterCategory, filterDifficulty, filterType]);
  

  // Table columns definition
  const columns = [
    {
      title: 'Тест номи',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: string) => {
        const category = categoryData.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Номаълум';
      },
    },
    {
      title: 'Қийинлик',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },
    {
      title: 'Тур',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Амалиётлар',
      key: 'actions',
      render: (_: any, record: TestDetails) => (
        <div className="flex gap-2">
          <Button onClick={() => openModal(record)} type="link" size="small">
            <MdEdit className='text-black hover:text-yellow-600' />
          </Button>
          <Button onClick={() => handleDelete(record.id!)} type="link" size="small">
            <MdDelete className='text-black hover:text-red-600' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Table to display the tests */}
    
  
      <div className="mb-5 w-full flex justify-between items-center flex-wrap xl:flex-nowrap gap-5">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={() => openModal()}>
          <div className="flex justify-center items-center">
            <MdOutlineAddCircle className="text-4xl mr-3" />
            <p className="text-lg font-bold">Қўшиш</p>
          </div>
        </button>
      </div>
  
      <div className="flex gap-5 mb-5">
        <Select
          value={filterCategory}
          onChange={(value) => setFilterCategory(value)}
          placeholder="Категория фильтри"
          className="w-full"
        >
          <Option value="">Барчаси</Option>
          {categoryData.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
  
        <Select
          value={filterDifficulty}
          onChange={(value) => setFilterDifficulty(value)}
          placeholder="Қийинлик фильтри"
          className="w-full"
        >
          <Option value="">Барчаси</Option>
          <Option value="HARD">Қийин</Option>
          <Option value="MEDIUM">Ўрта</Option>
          <Option value="EASY">Осон</Option>
        </Select>
  
        <Select
          value={filterType}
          onChange={(value) => setFilterType(value)}
          placeholder="Тур фильтри"
          className="w-full"
        >
          <Option value="">Барчаси</Option>
          <Option value="SUM">Ҳисобланган натижа</Option>
          <Option value="ONE_CHOICE">Бир тўғри жавобли тест</Option>
          <Option value="MANY_CHOICE">Кўп тўғри жавобли тест</Option>
        </Select>
      </div>
      <Table
        dataSource={testList}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="mb-5"
      />
      {/* Modal for adding or editing tests */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-[40rem]">
            <h2 className="text-center text-xl font-bold mb-5">{isEditing ? 'Тест таҳрирлаш' : 'Тест қўшиш'}</h2>
  
            <input
              type="text"
              value={testDetails.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Тест номини киритинг"
              className="w-full rounded-lg border py-2 px-5 mb-4 text-black outline-none focus:border-primary"
            />
  
            <div className="mb-4">
              <label className="block mb-2">Категория</label>
              <Select
                value={testDetails.categoryId}
                onChange={(value) => handleChange('categoryId', value)}
                placeholder="Категорияни танланг"
                className="w-full"
              >
                {categoryData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
  
            <div className="mb-4">
              <label className="block mb-2">Қийинлик</label>
              <Select
                value={testDetails.difficulty}
                onChange={(value) => handleChange('difficulty', value)}
                placeholder="Қийинлик даражасини танланг"
                className="w-full"
              >
                <Option value="HARD">Қийин</Option>
                <Option value="MEDIUM">Ўрта</Option>
                <Option value="EASY">Осон</Option>
              </Select>
            </div>
  
            <div className="mb-4">
              <label className="block mb-2">Тур</label>
              <Select
                value={testDetails.type}
                onChange={(value) => handleChange('type', value)}
                placeholder="Турни танланг"
                className="w-full"
              >
                <Option value="SUM">Ҳисобланган натижа</Option>
                <Option value="ONE_CHOICE">Бир тўғри жавобли тест</Option>
                <Option value="MANY_CHOICE">Кўп тўғри жавобли тест</Option>
              </Select>
            </div>
  
            <div className="mb-4">
              <label className="block mb-2">Вариантлар</label>
  
              {/* Default option */}
              {testDetails.optionDtos.length === 0 && (
                <div className="flex gap-4 mb-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={handleAddOption}
                  >
                    +
                  </button>
                  <input
                    type="text"
                    value=""
                    placeholder="Жавоб"
                    className="w-full rounded-lg border py-2 px-5 text-black"
                    disabled
                  />
                  <input type="checkbox" disabled />
                </div>
              )}
  
              {/* Dynamic options */}
              {testDetails.optionDtos.map((option, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  {/* Remove button only if there are more than 1 option */}
                  {testDetails.optionDtos.length > 1 && (
                    <button
                      className="bg-red-500 text-white p-2 rounded"
                      onClick={() => handleRemoveOption(index)}
                    >
                      -
                    </button>
                  )}
                  <input
                    type="text"
                    value={option.answer}
                    onChange={(e) => handleOptionChange(index, 'answer', e.target.value)}
                    placeholder="Жавоб"
                    className="w-full rounded-lg border py-2 px-5 text-black"
                  />
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                  />
                </div>
              ))}
  
              {/* Add button */}
              <button
                onClick={handleAddOption}
                className="bg-green-500 text-white p-2 rounded mt-2"
              >
                +
              </button>
            </div>
  
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={closeModal}
              >
                Ёпиш
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleSubmit}
              >
                Сақлаш
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
};

export default AddTest;
