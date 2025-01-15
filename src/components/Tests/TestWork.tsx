import React, { useState, useEffect } from 'react';

// API'dan qaytgan ma'lumotlar tipi
interface OptionDto {
  id: number;
  answer: string;
  isCorrect: boolean;
  questionId: number;
}

interface QuestionDto {
  id: number;
  name: string;
  categoryName: string;
  categoryId: number;
  optionDtos: OptionDto[];
}

interface QuizData {
  message: string;
  success: boolean;
  status: string;
  body: {
    countAnswers: number;
    duration: number;
    questionDtoList: QuestionDto[];
    type: string;
  };
}

const TestWork: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null); // API ma'lumotlarini saqlash

  useEffect(() => {
    // API so'rovini yuborish
    const token = sessionStorage.getItem('token');
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://142.93.106.195:9090/quiz/start/58`, {
          method: 'GET', // GET so'rovi
          headers: {
            'Authorization': `Bearer ${token}`, // Tokenni Authorization headerga qo'shish
            'Content-Type': 'application/json', // JSON formatini ko'rsatish
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const data: QuizData = await response.json(); // API'dan qaytgan ma'lumotni olish
        setQuizData(data); // Ma'lumotni holatga saqlash
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []); // faqat komponent yuklanganda so'rov yuboriladi

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Test Ishlash</h1>
      {quizData ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{quizData.message}</h2>
          <p className="mb-4">Status: {quizData.status}</p>
          <p className="mb-4">Success: {quizData.success ? 'Yes' : 'No'}</p>
          <p className="mb-4">Duration: {quizData.body.duration} minutes</p>
          <p className="mb-4">Answers Count: {quizData.body.countAnswers}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizData.body.questionDtoList.map((question) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{question.name}</h3>
                <p className="text-gray-500 mb-4">Category: {question.categoryName}</p>

                <div className="space-y-4">
                  {question.optionDtos.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border ${option.isCorrect ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}
                    >
                      <p className="text-lg">{option.answer}</p>
                      <p className="text-sm text-gray-500">{option.isCorrect ? 'Correct' : 'Incorrect'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Test ma'lumotlari yuklanmoqda...</p>
      )}
    </div>
  );
}

export default TestWork;
