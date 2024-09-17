import { useState, useEffect } from "react";
import axios from "axios";
import QuizHeading from "./QuizHeading";
import QuestionDisplay from "./QuestionDisplay";
import ProgressBar from "./ProgressBar";
import { motion } from 'framer-motion';
import '../Utils/Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [progress, setProgress] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [timer, setTimer] = useState(10);
    const [timerId, setTimerId] = useState(null);
    const [attemptedQuestions, setAttemptedQuestions] = useState(0);
    const [navigationLocked, setNavigationLocked] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(
                    "https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple&encode=url3986"
                );
                const data = response.data.results.map((question) => ({
                    ...question,
                    question: decodeURIComponent(question.question),
                    correct_answer: decodeURIComponent(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map((answer) =>
                        decodeURIComponent(answer)
                    ),
                }));
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0 && !quizCompleted) {
            setTimer(10);
            const id = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(id);
                        handleNext();
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerId(id);
        }
        return () => clearInterval(timerId);
    }, [currentQuestionIndex, questions.length, quizCompleted]);

    const handleOptionChange = (e) => {
        if (!selectedOption) {
            setSelectedOption(e.target.value);
            setShowAnswer(true);
        }
    };

    const handleNext = () => {
        if (selectedOption === questions[currentQuestionIndex].correct_answer) {
            setCorrectAnswers(correctAnswers + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(""); // Allow reselection for the next question
            setShowAnswer(false);
            setProgress(((currentQuestionIndex + 1) / (questions.length - 1)) * 100);
            setAttemptedQuestions(attemptedQuestions + 1);
            setTimer(10);
            setNavigationLocked(true); // Lock navigation
        } else {
            setQuizCompleted(true);
            setProgress(100);
            const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
            highScores.push(scorePercentage);
            localStorage.setItem('highScores', JSON.stringify(highScores));
        }
    };

    const handlePrev = () => {
        if (!navigationLocked && currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(""); // Allow reselection for the previous question
            setShowAnswer(false);
            setProgress(((currentQuestionIndex - 1) / (questions.length - 1)) * 100);
        }
    };

    const handleRestart = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption("");
        setShowAnswer(false);
        setCorrectAnswers(0);
        setAttemptedQuestions(0);
        setQuizCompleted(false);
        setProgress(0);
        setNavigationLocked(false); // Reset navigation lock
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(
                    "https://opentdb.com/api.php?amount=5&category=23&difficulty=easy&type=multiple&encode=url3986"
                );
                const data = response.data.results.map((question) => ({
                    ...question,
                    question: decodeURIComponent(question.question),
                    correct_answer: decodeURIComponent(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map((answer) =>
                        decodeURIComponent(answer)
                    ),
                }));
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };
        fetchQuestions();
    };

    if (questions.length === 0) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                flexDirection: 'column'
            }}>
                <div className="spinner" style={{ 
                    border: '4px solid rgba(0, 0, 0, 0.1)', 
                    borderRadius: '50%', 
                    borderTop: '4px solid #3498db', 
                    width: '40px', 
                    height: '40px', 
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }}></div>
                Loading questions...
            </div>
        );
    }
    

    const currentQuestion = questions[currentQuestionIndex];
    const allOptions = [
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
    ].sort();

    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

    return (
        <>
                <QuizHeading />
            <div className="main-container">
                {!quizCompleted ? (
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="quiz-card"
                    >
                        <p className="timer">Time Left: {timer}s</p>
                        <QuestionDisplay
                            question={currentQuestion.question}
                            options={allOptions}
                            selectedOption={selectedOption}
                            onOptionChange={handleOptionChange}
                            disabled={!!selectedOption} // Disable options after selection
                        />
                        {showAnswer && (
                            <p className={`answer-text ${selectedOption === currentQuestion.correct_answer ? 'text-green-500' : 'text-red-500'}`}>
                                {selectedOption === currentQuestion.correct_answer
                                    ? `Correct Answer: ${currentQuestion.correct_answer}`
                                    : `Incorrect! The correct answer is: ${currentQuestion.correct_answer}`
                                }
                            </p>
                        )}
                        

                        <p className="question-stats">
                            Question {currentQuestionIndex + 1} of {questions.length}
                            <br />
                        </p>
                    </motion.div>
                ) : (
                    <div className="quiz-summary">
                        <h2 className="text-xl font-bold mb-4">Quiz Completed</h2>
                        <p className="text-lg mb-4">Your Score: {scorePercentage}%</p>
                        <button className="button button-restart" onClick={handleRestart}>
                            Restart Quiz
                        </button>
                        <HighScores />
                    </div>
                )}
            </div>
            {!quizCompleted && (
                <ProgressBar
                progress={progress}
                onPrev={handlePrev}
                onNext={handleNext}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === questions.length - 1}
                onFinish={handleNext} // Pass handleNext as onFinish for the last question
            />
            )}
        </>
    );
};

const HighScores = () => {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const topScores = highScores.slice().sort((a, b) => b - a).slice(0, 5);

    return (
        <div className="high-scores">
            <h3>Top Scores</h3>
            <ul>
                {topScores.map((score, index) => (
                    <li key={index}>Score {index + 1}: {score}%</li>
                ))}
            </ul>
        </div>
    );
};

export default Quiz;
