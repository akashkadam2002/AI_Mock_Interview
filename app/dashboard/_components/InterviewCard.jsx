import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const InterviewCard = ({ interview }) => {
    const router = useRouter();

    const onStart = ()=>{
       router.push(`/dashboard/interview/${interview?.mockId}`)
    }

    const checkFeedback = ()=>{
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
     }

    return (
        <div className='borde shadow-lg rounded-lg p-3'>
            <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-600'>Created At : {interview.createdAt}</h2>

            <div className='flex justify-between mt-5 gap-10' >
                <Button onClick={checkFeedback} size='sm' variant="outline" className="w-full">Feedback</Button>
                <Button onClick={onStart} size='sm'  className="w-full" >Start</Button>
            </div>
        </div>
    );
}

export default InterviewCard;
