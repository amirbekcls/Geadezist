import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import testimg from '../../../public/login.png';

interface TestInfo {
    id: number;
    name: string;
    duration: number;
    countQuestions: number;
}

const ClientTest: React.FC = () => {
    const [testInfo, setTestInfo] = useState<TestInfo[]>([]);
    const [questions, setQuestions] = useState<any[]>([]); // Savollarni saqlash uchun
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const categoriesUrl = 'http://142.93.106.195:9090/category';
            try {
                const response = await fetch(categoriesUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Kategoriyalarni olishda xatolik yuz berdi');
                }

                const data = await response.json();
                const categories: TestInfo[] = data.body.body.map((category: any) => ({
                    id: category.id,
                    name: category.name,
                    duration: category.duration || 0,
                    countQuestions: category.countQuestions || 0,
                }));
                setTestInfo(categories);
            } catch (error) {
                console.error('Xatolik:', error);
                alert('Server bilan bog‘lanishda xatolik yuz berdi.');
            }
        };

        fetchData();
    }, [token]);

    // Savollarni olish uchun yangi API so'rovi
    const fetchQuestions = async (categoryId: number) => {
        const questionsUrl = `http://142.93.106.195:9090/quiz/start/${categoryId}`;
        try {
            const response = await fetch(questionsUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Savollarni olishda xatolik yuz berdi');
            }

            const data = await response.json();
            setQuestions(data.body.questionDtoList); // Savollarni saqlash
            navigate(`/client/test/work?id=${categoryId}`); // Testni boshlash
        } catch (error) {
            console.error('Xatolik:', error);
            alert('Savollarni olishda xatolik yuz berdi.');
        }
    };

    const handleStartTest = (categoryId: number) => {
        fetchQuestions(categoryId); // Savollarni olish
    };

    return (
        <div className="w-[1430px] h-full m-auto">
            <div className="py-5">
                <h1 className="text-center text-4xl font-bold" style={{ color: 'rgb(255, 0, 0)' }}>
                    Yonalishlar
                </h1>
            </div>
            <div className="flex flex-col gap-5">
                {testInfo.length > 0 ? (
                    testInfo.map((info) => (
                        <div key={info.id} className="w-full rounded-lg h-[250px] border border-gray-400 pt-5 m-auto">
                            <div className="w-[1400px] flex flex-col gap-5 m-auto">
                                <div className="flex gap-5">
                                    <div className="w-[350px] object-contain h-[210px] pr-5">
                                        <img src={testimg} className="w-full h-full ml-2" alt="Testimg" />
                                    </div>
                                    <div className="flex justify-between w-full gap-[100px]">
                                        <div className="w-full">
                                            <h3 className="font-bold">{info.name}</h3>
                                            <p className="text-gray-700">{info.duration} (dak.)</p>
                                            <p className="text-gray-700">{info.countQuestions} savol</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end mt-[-60px]">
                                    <button
                                        onClick={() => handleStartTest(info.id)}
                                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
                                    >
                                        Boshlash
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-600 font-bold">Ma'lumot olish uchun kuting...</div>
                )}
            </div>
        </div>
    );
};

export default ClientTest;
