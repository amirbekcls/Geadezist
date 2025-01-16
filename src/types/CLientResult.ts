export interface ResultType {
    id:number
    firstName: string,
    lastName: string,
    categoryName: string,
    correctAnswers: number,
    countAnswers: number
    extraResDtoList:{
        categoryName: string,
        correctAnswer: number,
        countAnswer: number
      }[],
    durationTime: number,
    createdAt: number,
    status: string,
    message:string
    testScore: number,
    fileId: null
  }