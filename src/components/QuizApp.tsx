import React, { useState, useEffect } from 'react';
// import questions from '../assets/mcqs/maths.json';
import questions from '../assets/mcqs/matlab1.json';


// Types for the questions and options
type Option = {
  a: string;
  b: string;
  c: string;
  d: string;
};

type Question = {
  id: number;
  question: string;
  options: Option;
  answer: keyof Option;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const shuffleOptions = (options: Option): Option => {
  const entries = Object.entries(options) as [keyof Option, string][];
  const shuffledEntries = shuffleArray(entries);
  return Object.fromEntries(shuffledEntries) as Option;
};

const QuizApp: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: keyof Option }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState({ correct: 0, incorrect: 0 });
  const [incorrectAnswers, setIncorrectAnswers] = useState<Array<{
    questionNumber: number;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
  }>>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Type assertion for questions if needed
    const typedQuestions = questions as Question[];
    const shuffled: Question[] = shuffleArray(typedQuestions).map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));
    setShuffledQuestions(shuffled);
  }, []);

  const handleChange = (questionId: number, option: keyof Option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    const incorrectAnswersDetails: Array<{
      questionNumber: number;
      question: string;
      selectedAnswer: string;
      correctAnswer: string;
    }> = [];

    shuffledQuestions.forEach((q) => {
      const selectedAnswer = userAnswers[q.id];
      if (selectedAnswer === q.answer) {
        correctCount++;
      } else {
        incorrectCount++;
        incorrectAnswersDetails.push({
          questionNumber: q.id,
          question: q.question,
          selectedAnswer: q.options[selectedAnswer as keyof Option] || 'No answer',
          correctAnswer: q.options[q.answer],
        });
      }
    });

    setResult({ correct: correctCount, incorrect: incorrectCount });
    setIncorrectAnswers(incorrectAnswersDetails);
    setQuizCompleted(true);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Quiz App</h1>

      <div>
        {shuffledQuestions.map((q, index) => (
          <div key={q.id} className="question" style={{ marginBottom: '15px' }}>
            <strong>{index + 1}. {q.question}</strong>
            <div className="options" style={{ marginBottom: '20px' }}>
              {(Object.entries(q.options) as [keyof Option, string][]).map(([key, value]) => (
                <label
                  key={key}
                  className="option-label"
                  style={{
                    display: 'block',
                    margin: '5px 0',
                    padding: '5px',
                    cursor: 'pointer',
                    backgroundColor: userAnswers[q.id] === key ? '#f0f0f0' : '',
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={key}
                    checked={userAnswers[q.id] === key}
                    onChange={() => handleChange(q.id, key)}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!quizCompleted && (
        <button onClick={handleSubmit} style={{ display: 'block', marginTop: '20px' }}>
          Submit
        </button>
      )}

      {quizCompleted && (
        <div id="result" className="result" style={{ marginTop: '20px', fontWeight: 'bold' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
            <h2>Quiz Results</h2>
            <p>Total Questions: {shuffledQuestions.length}</p>
            <p>Correct Answers: {result.correct}</p>
            <p>Incorrect Answers: {result.incorrect}</p>
            <p>Score: {((result.correct / shuffledQuestions.length) * 100).toFixed(2)}%</p>
          </div>

          {incorrectAnswers.length > 0 ? (
            <div className="review-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Review Incorrect Answers</h3>
              {incorrectAnswers.map((item) => (
                <div key={item.questionNumber} className="incorrect-answer" style={{ backgroundColor: '#ffe6e6', padding: '10px', margin: '10px 0', borderRadius: '5px', borderLeft: '4px solid #ff4444' }}>
                  <p><strong>Question {item.questionNumber}:</strong> {item.question}</p>
                  <p className="wrong-option" style={{ color: '#dc3545', textDecoration: 'line-through' }}>Your Answer: {item.selectedAnswer}</p>
                  <p className="correct-option" style={{ color: '#28a745', fontWeight: 'bold' }}>Correct Answer: {item.correctAnswer}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="review-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3>Perfect Score! 🎉</h3>
              <p>Congratulations! You answered all questions correctly.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;