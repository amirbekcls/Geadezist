import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface OptionDto {
    id: number;
    answer: string;
    questionId: number;
    isCorrect: boolean;
    file: string | null;
}

interface QuestionDto {
    id: number;
    name: string;
    optionDtos: OptionDto[];
}

const TestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchQuestions = async () => {
            const apiUrl = `http://142.93.106.195:9090/quiz/start/${id}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setQuestions(data.body.questionDtoList);
            } catch (error) {
                console.error('Xatolik:', error);
                alert('Savollarni olishda xatolik yuz berdi.');
            }
        };

        fetchQuestions();
    }, [id]);

    return (
        <div className="w-[800px] m-auto">
            <h1 className="text-3xl font-bold text-center my-5">Savollar</h1>
            {questions.map((question) => (
                <div key={question.id} className="mb-5 p-4 border rounded-lg">
                    <h3 className="font-bold">{question.name}</h3>
                    <ul className="mt-2">
                        {question.optionDtos.map((option) => (
                            <li key={option.id} className="text-gray-700">
                                {option.answer}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TestPage;
