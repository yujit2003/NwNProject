import React from 'react';
import '../Utils/ProgressBar.css';

const ProgressBar = ({ progress, onPrev, onNext, isFirst, isLast, onFinish }) => {
    const handleClick = () => {
        if (isLast) {
            onFinish(); // Call the finish function if on the last question
        } else {
            onNext(); // Call the next function if not on the last question
        }
    };

    return (
        <div className="progress-container">
            <div className="progress-bar">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="progress-text">
                <p className='para'>
                {progress} %
                </p>
                <button 
                    className={`button button-prev ${isFirst ? 'disabled' : ''}`}
                    onClick={onPrev}
                    disabled={isFirst}
                >
                    Prev
                </button>
                <button 
                    className={`button button-next ${isLast ? 'disabled' : ''}`}
                    onClick={handleClick}
                    disabled={isLast && !isLast}
                >
                    {isLast ? 'Submit Quiz' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default ProgressBar;
