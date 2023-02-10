"use client"
import { useCallback, useEffect, useState } from 'react'
import CreateJobs from '../createJobs'
import { useRouter } from 'next/navigation'
import { Vacancy } from '@prisma/client'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function EditJob({searchParams}){
    const [jobData,setJobData] = useState<Vacancy>({} as Vacancy)
    let router = useRouter()

    useEffect(()=>{
        getSingleJob()
    },[])

    const getSingleJob = useCallback(()=>{
        setIsLoading(true)
        fetch(`/api/admin/jobs/getSingleJob?id=${searchParams.id}`,{
           method:'GET',
        }).then(res=> res.json()).then(data=> {
            if(data.code == 200){
                setTimeout(() => {
                    setIsLoading(false)
                    setJobData(data.data)
                    
                }, 2000);
            }
            else{
                setIsLoading(false)
                console.log(data.message)
            }
        })
    },[])
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [loadingMsg, setLoadingMsg] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (jobData.vacancyName.length == 0 || jobData.vacancyDescription.length == 0 || jobData.location.length == 0) {
            setError('Field Empty')
        }
        else {
            setIsLoading(true)
            setLoadingMsg('Wait, Updating New Record..')
            fetch(`/api/admin/jobs/editSingleVacancy?id=${jobData.id}`, {
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
                }
                else {
                    setError(data.message)
                }
            })
        }

    }

    return (isLoading ?
        <div className="grid place-content-center bg-amber-100 h-[100vh]">
            <p className="font-bold text-2xl text-black">{loadingMsg}</p>
            {isSuccess &&
                <div className="space-x-3 flex flex-row item-center">
                    <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer" onClick={() => router.back()}>Go Back</p>
                </div>}
        </div> :
        <div className=' w-[100vw] py-8 flex flex-col items-center bg-amber-100'>
            <div className='flex flex-row space-x-2'>
                <button className='flex flex-row items-center space-x-2' onClick={()=> router.back()}>
                        {/* <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ fontSize: 30,color: "orange" }}
                        />  */}
                        <p>leftarrow</p>
                        {/* <p className='text-2xl font-bold py-2 items-center '>Back</p> */}
                    </button>
                <p className='text-xl font-bold text-black my-5 '>Update Vacancy</p>
            </div>
            <form
                className='flex flex-col w-[50vw]'
                onSubmit={handleSubmit}>
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
                <textarea
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="name"
                    rows={8}
                    required
                    defaultValue={jobData.vacancyDescription}
                    placeholder='Job description'
                    onChange={(e) => setJobData({...jobData,vacancyDescription:e.target.value})}
                />
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
                    onChange={(e) => setJobData({...jobData,jobCount:e.target.value})}
                />
                <p className="font-medium text-md py-1">Job Salary</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="name"
                    type='number'
                    required
                    defaultValue={jobData.salary}
                    placeholder='Job Salary'
                    onChange={(e) => setJobData({...jobData,salary:e.target.value})}
                />
                <p className="font-medium text-md py-1">Form Fees</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="number"
                    type='text'
                    required
                    defaultValue={jobData.fees}
                    placeholder='Form Fees'
                    onChange={(e) => setJobData({...jobData,fees:e.target.value})}
                />
                <p className="font-medium text-md py-1">Last Apply Date</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                    name="date"
                    type='date'
                    required
                    defaultValue={jobData.lastSubmissionDate ? jobData.lastSubmissionDate.slice(0,10):''}
                    placeholder='Last Apply Date'
                    onChange={(e) => setJobData({...jobData,lastSubmissionDate:e.target.value})}
                />
                <p className="font-medium text-md py-1">Interview Date</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                    name="date"
                    type='date'
                    required
                    defaultValue={jobData.interviewDate ? jobData.interviewDate.slice(0,10):''}
                    placeholder='Interview Date'
                    onChange={(e) => setJobData({...jobData,interviewDate:e.target.value})}
                />

                <button
                    type='submit'
                    className='px-4 py-1 rounded-md bg-amber-600 w-full text-white'>Update</button>
            </form>
            <p>{error}</p>
        </div>
    )
}