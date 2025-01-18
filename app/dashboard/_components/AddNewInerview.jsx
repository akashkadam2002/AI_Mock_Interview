'use client'

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const AddNewInerview = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperiance, setJobExperiance] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResp, setJsonResp] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperiance);

        const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Yeras of Experiance:${jobExperiance} on the basis of given information give me the 10-20 interview question and answer in json format`;

        const result = await chatSession.sendMessage(inputPrompt);
        const mockJsonRes = (result.response.text()).replace('```json', '').replace('```', '')
        console.log(JSON.parse(mockJsonRes));
        setJsonResp(mockJsonRes);

        if (mockJsonRes) {
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: mockJsonRes,
                    jobPosition: jobPosition,
                    jobDesc: jobDesc,
                    jobExperience: jobExperiance,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-yyyy')
                }).returning({ mockId: MockInterview.mockId })

            console.log("ID: ", resp);
            if (resp) {
                setOpenDialog(false);
                router.push(`/dashboard/interview/${resp[0]?.mockId}`);
            }
        }
        else {
            console.log("Error")
        }
        setLoading(false);
    }

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)} >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job Interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>

                                <div>
                                    <h2>Add details about your job position/role, job description and years of experiance</h2>
                                    <div className='mt-7 my-3'>
                                        <label>Job Role/Job Position</label>
                                        <Input className='mt-3' placeholder='Ex. Full Stack Developer' required onChange={(e) => setJobPosition(e.target.value)} />
                                    </div>

                                    <div className='mt-7 my-3'>
                                        <label>Job Description</label>
                                        <Textarea className='mt-3' placeholder='Ex. React, NodeJs, MongoDB etc' required onChange={(e) => setJobDesc(e.target.value)} />
                                    </div>

                                    <div className='mt-7 my-3'>
                                        <label>Years of Experiance</label>
                                        <Input className='mt-3' placeholder='Ex. 1' type='number' max='25' required onChange={(e) => setJobExperiance(e.target.value)} />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type='button' variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type='submit' disabled={loading} >
                                        {
                                            loading ? <> <LoaderCircle className='animate-spin' /> Generating From AI</> : "Start Interview"
                                        }
                                    </Button>
                                </div>
                            </form>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default AddNewInerview;
