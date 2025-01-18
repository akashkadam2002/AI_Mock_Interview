'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAIModal';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

const RecordAnswer = ({ mockInterviewQues, activeQuestion, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(activeQuestion);

    const { user } = useUser();
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    // const validateAnswer = (answer) => {
    //     const wordCount = answer.trim().split(/\s+/).length;
    //     return wordCount >= 10;
    // };

    useEffect(() => {
        if (results.length > 0) {
            const latestResult = results[results.length - 1]?.transcript || '';
            setUserAnswer((prev) => prev + latestResult.trim() + ' ');
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAns();
        }
    }, [userAnswer]);


    const StartStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();


        } else {
            startSpeechToText();
        }
    };

    const UpdateUserAns = async () => {
        console.log("User Answer:", userAnswer);

        setLoading(true);
        const feedback = `Question: ${mockInterviewQues[activeQuestion]?.question}, User Answer: ${userAnswer}, Depends on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 4-5 lines to improve it in JSON format with rating field and feedback field`;

        const result = await chatSession.sendMessage(feedback);
        const mockJsonResp = (await result.response.text())
            .replace('```json', '')
            .replace('```', '');
        console.log(mockJsonResp);
        const jsonFeedbackres = JSON.parse(mockJsonResp);

        const res = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQues[activeQuestion]?.question,
                correctAns: mockInterviewQues[activeQuestion]?.answer,
                userAns: userAnswer,
                feedback: jsonFeedbackres?.feedback,
                rating: jsonFeedbackres?.rating,
                userEmail: user?.primaryEmailAddress.emailAddress,
                createdAt: moment().format('DD-MM-yyyy')
            });


        if (res) {
            toast("User Answer recorded successfully...");
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);

    }

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5">
                <Image
                    src={'/webcam.png'}
                    width={200}
                    height={200}
                    className="absolute"
                />
                <Webcam
                    mirrored="true"
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                disabled={loading}
                className="my-10"
                variant="outline"
                onClick={StartStopRecording}
            >
                {isRecording ? (
                    <h2 className="text-red-600 flex gap-2">
                        <PauseCircle />
                        Stop Recording
                    </h2>
                ) : (
                    <h2 className="text-primary flex gap-2 border-blue-500 shadow-lg">
                        <Mic />
                        Start Recording
                    </h2>
                )}
            </Button>
        </div>
    );
};

export default RecordAnswer;
