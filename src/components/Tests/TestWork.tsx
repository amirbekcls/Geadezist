import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Timer, ChevronUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

interface OptionDto {
  id: number;
  answer: string;
  isCorrect: boolean;
}

interface QuestionDto {
  id: number;
  name: string;
  optionDtos: OptionDto[];
  type: string; // MANY_CHOICE or ONE_CHOICE
}

const TestWork: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string[]>>(new Map());
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('id');
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!categoryId) return;

      const apiUrl = `http://142.93.106.195:9090/quiz/start/${categoryId}`;
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
          return;
        }

        const data = await response.json();
        setQuestions(data.body.questionDtoList);
      } catch (error) {
        console.error('Xatolik:', error);
        alert('Server bilan bog‘lanishda xatolik yuz berdi.');
      }
    };

    fetchQuestions();
  }, [categoryId]);

  const currentQuestion = questions[currentPage - 1];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAnswerChange = (questionId: number, answer: string, isChecked: boolean) => {
    setSelectedAnswers((prev) => {
      const currentAnswers = prev.get(questionId) || [];
      if (isChecked) {
        return new Map(prev).set(questionId, [...currentAnswers, answer]);
      } else {
        return new Map(prev).set(questionId, currentAnswers.filter((a) => a !== answer));
      }
    });
  };

  const handleSubmitAnswer = () => {
    const currentQuestionData: QuestionDto = questions[currentPage - 1];
    const selectedAnswer: string[] = selectedAnswers.get(currentQuestionData.id) || [];
    const correctOptions: OptionDto[] = currentQuestionData.optionDtos.filter((option) => option.isCorrect);
    const correctAnswerIds: string[] = correctOptions.map((option) => option.answer);
  
    let isCorrect: boolean = false;
  
    if (currentQuestionData.type === 'ONE_CHOICE' && selectedAnswer.length === 1) {
      isCorrect = correctAnswerIds.includes(selectedAnswer[0]);
    } else if (currentQuestionData.type === 'MANY_CHOICE') {
      isCorrect =
        selectedAnswer.every((answer) => correctAnswerIds.includes(answer)) &&
        selectedAnswer.length === correctAnswerIds.length;
    }
  
    if (isCorrect) {
      setCorrectAnswers((prev: number) => prev + 1);
    }
  
    if (currentPage < questions.length) {
      setCurrentPage(currentPage + 1);
    } else {
      submitTest();
    }
  
    setSelectedAnswers((prev: Map<number, string[]>) => new Map(prev).delete(currentQuestionData.id));
  };
  

  const submitTest = async () => {
    const duration: number = Math.floor((Date.now() - startTime) / 1000); // Test davomiyligi (sekundlarda)
    let correctAnswers = 0; // To'g'ri javoblar soni
    let wrongAnswers = 0; // Noto'g'ri javoblar soni
    const countAnswers: number = questions.length; // Barcha javoblar soni
  
    // Javoblarni tekshirish va to'g'ri javoblarni hisoblash
    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers.get(question.id);
      const correctOptions = question.optionDtos.filter((option) => option.isCorrect);
      const correctAnswerIds = correctOptions.map((option) => option.answer);
  
      if (selectedAnswer) {
        if (correctAnswerIds.includes(selectedAnswer[0])) {
          correctAnswers += 1; // To'g'ri javoblar soni
        } else {
          wrongAnswers += 1; // Noto'g'ri javoblar soni
        }
      }
    });
  
    // Request body
    const requestBody = questions.map((question) => {
      const selectedAnswer = selectedAnswers.get(question.id);
      const selectedOptionIds = question.optionDtos
        .filter((option) => selectedAnswer?.includes(option.answer))
        .map((option) => option.id);
  
      return {
        questionId: question.id,
        optionIds: selectedOptionIds, // Multiple options for MANY_CHOICE
        answer: selectedAnswer ? selectedAnswer.join(', ') : '', // Store all selected answers for MANY_CHOICE
      };
    });
  
    const apiUrl = `http://142.93.106.195:9090/quiz/pass/${categoryId}?duration=${duration}&countAnswers=${countAnswers}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), // Body qo'shildi
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Xatolik:', errorData);
        alert(`Xatolik: ${errorData.message}`);
      } else {
        const data = await response.json();
        // alert(`Test yakunlandi! Siz ${correctAnswers} ta to'g'ri javob berdingiz. Noto'g'ri javoblar: ${wrongAnswers}`);
        toast.success('Test Yakunlandi')
        navigate('/client/test/result'); // Natija sahifasiga o'tish
      }
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Testni yuborishda xatolik yuz berdi.');
    }
  };
  
  

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Test Savollari</h1>
        <div className="flex items-center text-gray-600">
          <Timer className="w-5 h-5 mr-2" />
          <span>9:54</span>
        </div>
      </div>

      {currentQuestion ? (
        <div>
          <div key={currentQuestion.id} className="mb-6 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.name}</h3>
            <ul className="space-y-4">
              {currentQuestion.optionDtos.map((option) => (
                <li key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type={currentQuestion.type === 'MANY_CHOICE' ? 'checkbox' : 'radio'}
                    name={`answer-${currentQuestion.id}`}
                    value={option.answer}
                    checked={selectedAnswers.get(currentQuestion.id)?.includes(option.answer)}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, option.answer, e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{option.answer}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-6 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">Savollar yuklanmoqda...</p>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleSubmitAnswer}
          className="flex items-center px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Savolni yakunlash
          <ChevronUp className="ml-2 w-5 h-5" />
        </button>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default TestWork;
