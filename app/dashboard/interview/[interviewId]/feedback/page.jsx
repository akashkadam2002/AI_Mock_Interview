'use client'

import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Feedback = ({ params }) => {

    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);

    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);

        if (Array.isArray(result) && result.length > 0) {
            console.log("Fetched Feedback Data:", result);

            const totalRating = result.reduce((sum, item) => {
                const rating = Number(item.rating) || 0; // Convert rating to number, default to 0 if NaN
                return sum + rating;
            }, 0);

            const avgRating = totalRating / result.length;

            setOverallRating(avgRating.toFixed(1));
        } else {
            setOverallRating("0.0");
        }


    }
    return (
        <div className='p-10'>

            {feedbackList?.length === 0 ?
                <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback found</h2>
                :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congratulations..!</h2>
                    <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>

                    <h2 className='text-primary text-lg my-3'>
                        Your overall interview rating: <strong>{overallRating}/10</strong>
                    </h2>

                    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>
                    {feedbackList && feedbackList.map((item, index) => (
                        <div className='mt-7'>
                            <Collapsible key={index}>
                                <CollapsibleTrigger className='p-2 flex justify-between gap-3 bg-gray-200 rounded-lg my-2 text-left w-full'>
                                    {item.question} <ChevronsUpDown className='h-4 w-5' />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating : </strong>{item.rating}</h2>
                                        <h2 className='p-2 border rounded-lg bg-red-100 text-sm text-red-600'><strong>Your Answer : </strong>{item.userAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-green-100 text-sm text-green-600'><strong>Correct Answer : </strong>{item.correctAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-blue-100 text-sm text-primary'><strong>Feedback : </strong>{item.feedback}</h2>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                        </div>

                    ))}
                </>
            }

            <Button className="mt-10" onClick={() => router.replace('/dashboard')} >Go Home</Button>
        </div>
    );
}

export default Feedback;
