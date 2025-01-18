'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [resolvedParams, setResolvedParams] = useState(null); // Add a state for resolved params

  useEffect(() => {
    const fetchParamsAndDetails = async () => {
      try {
        const resolved = await params;
        setResolvedParams(resolved); // Store resolved params in state
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
      console.log(result);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className='my-10'>
      <h1 className='font-bold text-2xl text-center'>Let's Get Started</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div className='flex flex-col my-5 gap-5 justify-center'>
          <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border justify-center'>
            {interviewData ? (
              <>
                <h2 className='text-lg'>
                  <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
                </h2>

                <h2 className='text-lg'>
                  <strong>Job Description:</strong> {interviewData.jobDesc}
                </h2>

                <h2 className='text-lg'>
                  <strong>Years of Experience:</strong> {interviewData.jobExperience} <strong> Years</strong>
                </h2>
              </>
            ) : (
              <p>Loading interview details...</p>
            )}
          </div>

          <div className='p-5 border rounded-lg border-yellow-200 bg-yellow-200'>
            <h2 className='flex gap-2 items-center pb-3 text-yellow-500'>
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          {webCamEnable ? (
            <Webcam
              onUserMedia={() => setWebCamEnable(true)}
              onUserMediaError={() => setWebCamEnable(false)}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <WebcamIcon className='h-60 w-full my-7 p-20 rounded-lg border bg-secondary' />
              <Button onClick={() => setWebCamEnable(true)} className="my-5">
                Enable Web Cam and Microphone
              </Button>
            </>
          )}

          <div className="flex gap-4 mt-4">
            <div className="flex-shrink-0" />
            {resolvedParams && (
              <Link href={`/dashboard/interview/${resolvedParams.interviewId}/start`}>
                <Button className="ml-4">Start Interview</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
