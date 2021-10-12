import React, { useState } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions, Difficulty, QuestionsState } from "./API";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};


const TOTAL_QUESTIONS = 10;

const App = () => {
  //https://opentdb.com/api.php?amount=
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const isNotGameOver = !gameOver;
  const isNotLoading = !loading;
  const userAnsweredCurrentQuestion = userAnswers.length === number + 1;
  const isNotTheLastQuestion = number !== TOTAL_QUESTIONS - 1;

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isNotGameOver) {
      const answer = event.currentTarget.value;

      //check answer agains the correct answer
      const correct = questions[number].correct_answer === answer;
      //add score if the answer is correct
      if (correct) setScore((prevScore) => prevScore + 1);
      //save answer in the arrray of user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswers((prevAnswers) => [...prevAnswers, answerObject]);
    }
  };

  const nextQuestion = () => {
    //move on to the next question if you are not int hte last question
    const nextQuestion = number + 1;
    const lastQuestion = nextQuestion === TOTAL_QUESTIONS;

    if (lastQuestion) {
      setGameOver(true);
    }

    setNumber(nextQuestion);
  };

  return (
    <div className="App">
      <h1>React Quiz</h1>
      <p className="score">Score:</p>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}
      {isNotGameOver ? <p className="score">Score: {score}</p> : null}
      {loading ? <p>Loading Questions...</p> : null}
      {isNotLoading && isNotGameOver && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {isNotGameOver &&
      isNotLoading &&
      userAnsweredCurrentQuestion &&
      isNotTheLastQuestion ? (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      ) : null}
    </div>
  );
};

export default App;
