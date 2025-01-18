'use client';

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Questions from './_components/Questions';
import RecordAnswer from './_components/RecordAnswer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQues, setMockInterviewQues] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [currentSet, setCurrentSet] = useState(0); // Tracks which set of 5 questions is shown

    useEffect(() => {
        const fetchParamsAndDetails = async () => {
            try {
                const resolved = await params;
                await getInterviewDetails(resolved.interviewId);
            } catch (error) {
                console.error("Error resolving params or fetching details:", error);
            }
        };

        fetchParamsAndDetails();
    }, [params]);

    const getInterviewDetails = async (id) => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, id));

            if (result.length === 0) {
                console.error("No data found for the given mockId.");
                return;
            }

            const rawJson = result[0].jsonMockResp;
            const jsonMockResp = JSON.parse(rawJson);

            if (
                jsonMockResp.interviewQuestions &&
                Array.isArray(jsonMockResp.interviewQuestions)
            ) {
                setMockInterviewQues(jsonMockResp.interviewQuestions);
            } else {
                setMockInterviewQues([]);
            }

            setInterviewData(result[0]);
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    const totalSets = Math.ceil(mockInterviewQues.length / 6); // Total sets of 5 questions
    const currentQuestions = mockInterviewQues.slice(currentSet * 6, (currentSet + 1) * 6);

    const handleNext = () => {
        if (activeQuestion < mockInterviewQues.length - 1) {
            setActiveQuestion((prev) => prev + 1);
            if ((activeQuestion + 1) % 6 === 0) {
                setCurrentSet((prev) => Math.min(prev + 1, totalSets - 1));
            }
        }
    };

    const handlePrevious = () => {
        if (activeQuestion > 0) {
            setActiveQuestion((prev) => prev - 1);
            if (activeQuestion % 6 === 0) {
                setCurrentSet((prev) => Math.max(0, prev - 1));
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side - Question Navigation */}
            <div>
                <div className='grid grid-cols-3 gap-4'>
                    {currentQuestions.map((q, index) => (
                        <button
                            key={index}
                            className={`p-2 rounded-full ${activeQuestion === currentSet * 6 + index ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveQuestion(currentSet * 6 + index)}
                        >
                            Question #{currentSet * 6 + index + 1}
                        </button>
                    ))}
                </div>

                {/* Display Active Question Content */}
                {mockInterviewQues[activeQuestion] && (
                    <div className='mt-4'>
                        <Questions mockInterviewQues={[mockInterviewQues[activeQuestion]]} activeQuestion={0} />
                    </div>
                )}
            </div>

            {/* Right side - Record Answer Section */}
            <div className='mt-4 md:mt-0'>
                {mockInterviewQues[activeQuestion] && (
                    <RecordAnswer
                        mockInterviewQues={[mockInterviewQues[activeQuestion]]}
                        activeQuestion={0}
                        interviewData={interviewData}
                    />
                )}

                <div className='flex justify-end gap-8 mt-6'>
                    <Button
                        onClick={handlePrevious}
                        disabled={activeQuestion === 0}
                    >
                        Previous Question
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={activeQuestion === mockInterviewQues.length - 1}
                    >
                        Next Question
                    </Button>

                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`} >

                    <Button
                        disabled={activeQuestion !== mockInterviewQues.length - 1}
                        className="bg-red-500 text-white">
                        End Interview
                    </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StartInterview;
