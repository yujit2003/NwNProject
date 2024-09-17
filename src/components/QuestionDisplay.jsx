import React from 'react';
import "../Utils/QuestionDisplay.css";

const QuestionDisplay = ({ question, options, selectedOption, onOptionChange, disabled }) => {
    const handleOptionClick = (option) => {
        if (!disabled) {
            // Simulate an onChange event for the radio input
            const event = {
                target: {
                    value: option,
                },
            };
            onOptionChange(event); // Call onOptionChange with the option value
        }
    };

    return (
        <div className="question-display">
            <h2 className="question-text">{question}</h2>
            <form className="options">
                {options.map((option) => (
                    <div
                        key={option}
                        className={`option-container ${selectedOption === option ? 'selected' : ''}`} 
                        onClick={() => handleOptionClick(option)} // Handle clicks on the container
                    >
                        <input
                            type="radio"
                            id={option}
                            name="quiz-option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={onOptionChange}
                            disabled={disabled}
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
