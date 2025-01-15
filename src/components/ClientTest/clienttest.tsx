import  { useState, useEffect } from 'react';
import testimg from '../../../public/login.png';

type Test = {
    categoryId: number;
    categoryName: string;
    duration: number;
    countAnswers: number;
};

function ClientTest() {
    const [testInfo, setTestInfo] = useState<Test[]>([]); 
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            const categoriesUrl = 'http://142.93.106.195:9090/category'; // Barcha kategoriyalarni olish uchun API endpoint
            const apiUrl = (categoryId: number) =>
                `http://142.93.106.195:9090/quiz/start/${categoryId}`;

            try {
                // Barcha kategoriyalarni olish
                const categoriesResponse = await fetch(categoriesUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!categoriesResponse.ok) {
                    throw new Error('Kategoriyalarni olishda xatolik yuz berdi');
                }

                const categoriesData = await categoriesResponse.json();
                console.log('Categories Data:', categoriesData); // API javobini ko'rish

                if (!categoriesData.body || !Array.isArray(categoriesData.body.body)) {
                    throw new Error('Kategoriya ma\'lumotlari mavjud emas yoki noto\'g\'ri formatda');
                }

                const categoryIds = categoriesData.body.body.map((category: { id: number }) => category.id);

                if (categoryIds.length === 0) {
                    throw new Error('Kategoriya ID-lari topilmadi');
                }

                // Har bir categoryId uchun API chaqiruvini yuborish
                const responses = await Promise.all(
                    categoryIds.map((categoryId: number) =>
                        fetch(apiUrl(categoryId), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        })
                    )
                );

                const data = await Promise.all(responses.map((response) => response.json()));
                console.log('API Response Data:', data);

                // Har bir categoryId uchun testInfo ni saqlash
                const newTestInfo = data.map((response) => {
                    const body = response.body;
                    if (body && body.questionDtoList && Array.isArray(body.questionDtoList)) {
                        return {
                            categoryId: body.questionDtoList[0].categoryId,
                            categoryName: body.questionDtoList[0].categoryName,
                            duration: body.duration,
                            countAnswers: body.questionDtoList.length, // Savollar sonini olish
                        };
                    }
                    return null; // Agar questionDtoList bo'lmasa, null qaytarish
                }).filter((item) => item !== null); // null qiymatlarni filtrlash

                setTestInfo(newTestInfo); // testInfo ni yangilash

            } catch (error) {
                console.error('Xatolik:', error);
                alert('Server bilan bog\'lanishda xatolik yuz berdi.');
            }
        };

        fetchData(); // useEffect ichida fetchData ni chaqirish
    }, []);
    const list = [
        {
            "name": "Юналышлар:",
            "key": 1
        },
        {
            "name": "Тест ишлашга ажратилган вақт:",
            "key": 2
        },
        {
            "name": "Саволлар сони:",
            "key": 3
        },
        {
            "name": "Қайта топшириш вақти:",
            "key": 4
        }
    ]
    
    return (
        <div className="w-[1430px] h-full m-auto ">
            <div className="py-5">
                <h1 className="text-center text-4xl font-bold" style={{ color: 'rgb(255, 0, 0)' }}>
                    Yonalishlar
                </h1>
            </div>
            <div className="flex flex-col gap-5">
                {testInfo.length > 0 ? (
                    testInfo.map((info) => (
                        <div className="w-full rounded-lg h-[250px] border border-gray-400 pt-5 m-auto">
                            <div className="w-[1400px] flex flex-col gap-5 m-auto">
                                <div className="flex gap-5">
                                    {/* Rasm */}
                                    <div className="w-[350px] object-contain h-[210px] pr-5">
                                        <img src={testimg} className="w-full h-full ml-2" alt="Testimg" />
                                    </div>
                                    {/* API ma'lumotlari */}
                                    <div className="flex justify-between w-full gap-[100px]">
                                        <div className="w-full">
                                            <ol className='flex flex-col gap-3'>
                                                {list.map((item) => (
                                                    <li key={item.key}>{item.name}</li>
                                                ))}
                                            </ol>
                                        </div>
                                     <div className="w-full flex flex-col gap-3">
                                            <h3 className="font-bold">{info.categoryName}</h3>
                                            <p className="text-gray-700"> {info.duration} (дак.) </p>
                                            <p className="text-gray-700">{info.countAnswers}</p>
                                            <p className="text-gray-700">0 кундан кейин</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex justify-end mt-[-60px]">
                                    <button
                                        onClick={() => { }}
                                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
                                    >
                                        Boshlash
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-600 font-bold">
                        Ma'lumot olish uchun "Boshlash" tugmasini bosing.
                    </div>
                )
                }
            </div>


        </div >
    );
}

export default ClientTest;
