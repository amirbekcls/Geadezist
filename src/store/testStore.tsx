import { create } from 'zustand';
import { OptionsDto, Test, TestList, TestMainData } from '../types/test';

const useTestStore = create<Test>((set) => ({
  quizData: {
    quiz: {
      questionDtoList: [],
      countAnswers: 0,
      duration: 0
    },
    quizList: [],
    currentQuestionIndex: 0,
    remainingTime: 0
  },
  resultId: 0,
  // result: '',
  // setResult: (val: string) => set({ result: val }),
  setResultId: (val: number) => set({ resultId: val }),
  setQuizData: (val: TestMainData) => set({ quizData: val }),
  currentIndex: 0,
  setCurrentIndex: (val: number) => set({ currentIndex: val }),

  // admin u/n
  testList: null,
  setTestList: (val: TestList[] | null) => set({ testList: val }),
  optionDto: null,
  setOptionDto: (val: null | OptionsDto[]) => set({ optionDto: val }),
  testOne: null,
  setTestOne: (val: TestList | null) => set({ testOne: val }),
}));

export default useTestStore;