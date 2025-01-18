import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

const Questions = ({ mockInterviewQues, activeQuestion }) => {

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Your browser does not support text to speech');
        }
    };

    return mockInterviewQues && (
        <div className='p-2 border rounded-lg my-12'>
            {/* <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
                {mockInterviewQues && mockInterviewQues.length > 0 ? (
                    mockInterviewQues.map((question, index) => (
                        <div key={index} className='mb-4'>
                            <h2 className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
                                ${activeQuestion === index ? 'bg-primary text-white' : 'bg-secondary'}`}>
                                Question #{index + 1}
                            </h2>
                        </div>
                    ))
                ) : (
                    <p>No questions available.</p>
                )}
            </div> */}

            <h2 className='my-5 text-md md:text-lg mt-10'>
                {mockInterviewQues[activeQuestion]?.question}
            </h2>

            <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQues[activeQuestion]?.question)} />

            <div className='border rounded-lg p-5 bg-blue-200 mt-10'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>
                    {process.env.NEXT_PUBLIC_NOTE}
                </h2>
            </div>
        </div>
    );
};

export default Questions;
