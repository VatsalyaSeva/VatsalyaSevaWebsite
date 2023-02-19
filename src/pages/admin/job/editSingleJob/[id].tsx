"use client"
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Vacancy } from '@prisma/client'
import { AppProps } from 'next/app'
import { api } from '../../../../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import Lottie from 'lottie-react'
const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

EditJob.getInitialProps = async (ctx: { query: { id: string } }) => {
    return { id:ctx.query.id }
}

export default function EditJob(pageProp:AppProps['pageProps']){
    const [jobData,setJobData] = useState<Vacancy>({} as Vacancy)
    const router = useRouter()
    const getSingleJob = api.vacancy.getById.useQuery({id:pageProp.id,applicant:false})
    const updateSingleJob = api.vacancy.updateRecord.useMutation()

    useEffect(()=>{
        if(getSingleJob.isSuccess){
            const res = getSingleJob.data
            if(res){
                setJobData(res)
            }
        }
    },[getSingleJob.data])

    useEffect(()=>{
        if(updateSingleJob.isSuccess){
            router.back()
        }
    },[updateSingleJob.data])

    const handleSubmit = () => {
        updateSingleJob.mutate({
            id:pageProp.id,
            update:{
                vacancyName: jobData.vacancyName,
                vacancyDescription: jobData.vacancyDescription,
                jobCount: jobData.jobCount,
                salary: jobData.salary,
                interviewDate: jobData.interviewDate.toString(),
                lastSubmissionDate: jobData.lastSubmissionDate.toString(),
                location: jobData.location,
                fees: jobData.fees
            }
        })
    }

    return (updateSingleJob.isLoading || getSingleJob.isLoading ?
        <div className="grid place-content-center h-[400px] w-[100vw]">
            <Lottie 
                animationData={require('../../../../../public/lottie/loading.json')}
                className='h-[50px] w-[50px]'
            />
        </div> :
        <div className=' w-[100vw] md:px-8 px-4 py-5  flex flex-col items-center '>
            <div className='w-[80vw] my-5'>
                <div className='flex justify-between items-start w-full mb-5'>
                    <div className='flex items-start space-x-3'>
                        <button className='' onClick={()=> router.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                        </button>
                        <p className='md:text-xl text-md font-bold  items-center'>{jobData.vacancyName}</p>
                    </div>
                    <button className="bg-green-700  text-white px-3 py-1 rounded-lg"
                        onClick={()=> handleSubmit()}
                    >Update</button>
                </div>
                <form
                    className='flex flex-col '
                    >
                    <p className="font-medium text-md py-1">Job Name</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='text'
                        placeholder='Job name'
                        defaultValue={jobData.vacancyName}
                        required
                        onChange={(e) => setJobData({...jobData,vacancyName:e.target.value})}
                    />
                    <p className="font-medium text-md py-1">Job description</p>
                    
                    {jobData.vacancyDescription && <RichTextEditor 
                        onChange={(e) => setJobData({...jobData,vacancyDescription:e})} 
                        value={jobData.vacancyDescription}/>}
                    <p className="font-medium text-md py-1">Job location</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="address"
                        type='text'
                        required
                        defaultValue={jobData.location}
                        placeholder='Job location'
                        onChange={(e) => setJobData({...jobData,location:e.target.value})}
                    />
                    <p className="font-medium text-md py-1">Post Count</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='number'
                        required
                        defaultValue={jobData.jobCount}
                        placeholder='Post Count'
                        onChange={(e) => setJobData({...jobData,jobCount:parseInt(e.target.value)})}
                    />
                    <p className="font-medium text-md py-1">Job Salary</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='number'
                        required
                        defaultValue={jobData.salary}
                        placeholder='Job Salary'
                        onChange={(e) => setJobData({...jobData,salary:parseInt(e.target.value)})}
                    />
                    <p className="font-medium text-md py-1">Form Fees</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="number"
                        type='text'
                        required
                        defaultValue={jobData.fees}
                        placeholder='Form Fees'
                        onChange={(e) => setJobData({...jobData,fees:parseInt(e.target.value)})}
                    />
                    <p className="font-medium text-md py-1">Last Apply Date</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                        name="date"
                        type='date'
                        required
                        defaultValue={jobData.lastSubmissionDate ? jobData.lastSubmissionDate.toString().slice(0,10):''}
                        placeholder='Last Apply Date'
                        onChange={(e) => setJobData({...jobData,lastSubmissionDate:e.target.value})}
                    />
                    <p className="font-medium text-md py-1">Interview Date</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                        name="date"
                        type='date'
                        required
                        defaultValue={jobData.interviewDate ? jobData.interviewDate.toString().slice(0,10):''}
                        placeholder='Interview Date'
                        onChange={(e) => setJobData({...jobData,interviewDate:e.target.value})}
                    />

                
                </form>
            </div>
            
        </div>
    )
}

