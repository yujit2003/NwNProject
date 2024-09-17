// QuestionDisplay.js
import React from 'react';

const QuestionDisplay = ({ question, options, selectedOption, onOptionChange, disabled }) => {
    return (
        <div className="question-display">
            <h2 className="question-text">{question}</h2>
            <form className="options">
                {options.map((option) => (
                    <div key={option} className="option-container">
                        <input
                            type="radio"
                            id={option}
                            name="quiz-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={onOptionChange}
                            disabled={disabled} // Disable radio buttons if an option is already selected
                            className="option-radio"
                        />
                        <label htmlFor={option} className="option-label">
                            {option}
                        </label>
                    </div>
                ))}
            </form>
        </div>
    );
};

export default QuestionDisplay;
