"use client"
import { FormEvent, useCallback, useEffect, useState } from 'react'
import CreateJobs from '../../../../components/createJobs'
import { useRouter } from 'next/navigation'
import { Vacancy } from '@prisma/client'
import { AppProps } from 'next/app'
import { api } from '../../../../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

EditJob.getInitialProps = async (ctx) => {
    return { id:ctx.query.id }
}

export default function EditJob(pageProp:AppProps['pageProps']){
    const [jobData,setJobData] = useState<Vacancy>({} as Vacancy)
    let router = useRouter()
    const getSingleJob = api.vacancy.getById.useQuery({id:pageProp.id})
    useEffect(()=>{
        if(getSingleJob.isSuccess){
            setJobData(getSingleJob.data)
        }
    },[getSingleJob.data])
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [loadingMsg, setLoadingMsg] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = () => {
        
        if (jobData.vacancyName.length == 0 || jobData.vacancyDescription.length == 0 || jobData.location.length == 0) {
            setError('Field Empty')
        }
        else {
            setIsLoading(true)
            setLoadingMsg('Wait, Updating New Record..')
            fetch(`/api/admin/vaccancy/editSingleVacancy?id=${jobData.id}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: jobData.vacancyName,
                    description: jobData.vacancyDescription,
                    jobCount: jobData.jobCount,
                    salary: jobData.salary,
                    interviewDate: jobData.interviewDate,
                    lastSubmissionDate: jobData.lastSubmissionDate,
                    location: jobData.location,
                    applicationFee: jobData.fees
                })
            }).then(res => res.json()).then(data => {
                if (data.code == 200) {
                    // setIsLoading(false)
                    setLoadingMsg('Record Updated successfully...')
                    setIsSuccess(true)
                    router.back()
                }
                else {
                    setError(data.message)
                }
            })
        }

    }

    return (isLoading ?
        <div className="flex bg-gray-200 justify-center items-center flex-1 h-[100vh] w-[100vw]">
            <p className="font-bold text-2xl text-black">{loadingMsg}</p>
            {isSuccess &&
                <div className="space-x-3 flex flex-row item-center">
                    <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer" onClick={() => router.back()}>Go Back</p>
                </div>}
        </div> :
        <div className=' lg:w-[80vw] w-[100vw] md:px-8 px-4 py-5  flex flex-col items-center '>
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
                {/* <textarea
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="name"
                    rows={8}
                    required
                    defaultValue={jobData.vacancyDescription}
                    placeholder='Job description'
                    onChange={(e) => setJobData({...jobData,vacancyDescription:e.target.value})}
                /> */}
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
                    onChange={(e) => setJobData({...jobData,lastSubmissionDate:new Date(e.target.value)})}
                />
                <p className="font-medium text-md py-1">Interview Date</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                    name="date"
                    type='date'
                    required
                    defaultValue={jobData.interviewDate ? jobData.interviewDate.toString().slice(0,10):''}
                    placeholder='Interview Date'
                    onChange={(e) => setJobData({...jobData,interviewDate:new Date(e.target.value)})}
                />

            
            </form>
            <p>{error}</p>
        </div>
    )
}

