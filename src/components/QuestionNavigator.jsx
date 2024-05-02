import React from "react";

const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div
      style={{ border: "1px solid white" }}
      className="question-navigator grid grid-cols-5 w-56 justify-center p-2 rounded-md"
    >
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={`question-number text-white w-8 h-8 border border-gray-400 rounded-full mx-1 my-1 flex items-center justify-center cursor-pointer ${
            index === currentQuestionIndex ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => handleQuestionClick(index)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default QuestionNavigator;
