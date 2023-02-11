"use client"
import { Vacancy,Applecants } from '@prisma/client';
import { SingleJobComponent } from './singleJobComponent'
import React,{ useState,useEffect, useCallback } from 'react';
import { Loader } from '../../../components/loader'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from 'next';
import { AppProps } from 'next/app';


export default function viewSingleJob(pageProp:AppProps['pageProps']){
    const [jobData,setJobData] = useState<Vacancy>({} as Vacancy)
    const [allApplicant,setAllApplicant] = useState<Applecants[]>([])
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [serverError,setServerError] = useState<string>('')
    const router = useRouter()
    
    useEffect(()=>{
        getSingleJob()
        getAllApplicants()
    },[])

    const getSingleJob = useCallback(()=>{
        setIsLoading(true)
        fetch(`/api/admin/jobs/getSingleJob?id=${pageProp.searchParams.id}`,{
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
                setServerError(data.message)
            }
        })
    },[])
    const getAllApplicants = useCallback(()=>{
        fetch(`/api/admin/applicants/getAllApplicant?id=${pageProp.searchParams.id}`,{method:'GET'}).then(res=> res.json()).then(data=>{
            if(data.code == 200){
                setAllApplicant(data.data)
            }
            else{
                console.log(data.message)
            }
        })
    },[])

    return(
        <div className='h-[100vh] w-[100vw] bg-amber-100'>
            {isLoading ? <Loader isLoading={isLoading}/>:
            <div className='px-10 py-10'>
                <button className='flex flex-row items-center space-x-2' onClick={()=> router.back()}>
                <p>leftarrow</p>
                    <p className='text-2xl font-bold py-2 items-center '>Back</p>
                </button>
                {serverError.length == 0 ?
                    <div className='my-2 mx-8'>
                        <div className='grid grid-cols-[1fr_250px] '>
                            <div className=''>
                                <p className='text-4xl font-bold text-black'>{jobData.vacancyName}</p>
                                <div className='py-4 text-md'>{jobData.vacancyDescription}</div>
                                <div>
                                    <p className='text-2xl text-red-400 my-2'>All Applicants</p>
                                    {allApplicant.length>0 ?
                                    allApplicant.map((item,index)=>{
                                        return(
                                            <div key={index} className='flex flex-row justify-between items-center my-2 bg-amber-200 px-4 py-3 rounded-lg'>
                                                <div>
                                                    <p>{item.name}</p>
                                                    <p>{item.phone}</p>
                                                    <p>{item.email}</p>
                                                </div>
                                                <a 
                                                    className='px-5 py-2 rounded-lg text-md bg-red-500 text-white font-bold'
                                                    href={`/${item.cvFilePath}`} 
                                                    target={'_blank'}>View CV</a>
                                            </div>
                                        )
                                    }):<p className='flex flex-row justify-center items-center my-2 bg-amber-200 px-4 py-3 rounded-lg h-[80px] text-center w-[100%]'>No Applicant found</p>}
                                </div>
                            </div>
                            <div className='bg-amber-500 px-4 rounded-lg py-4 max-h-[300px] '>
                                <div className='flex flex-col justify-center items-center space-y-2'>
                                    <p className='text-3xl font-bold text-black'>{jobData.salary}₹</p>
                                    <p className='text-md text-center '>{jobData.location}</p>
                                </div>
                                <div className='flex flex-row justify-center space-x-4 py-2'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='text-white font-bold'>Total Jobs</p>
                                        <p className=''>{jobData.jobCount}</p>
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='text-white font-bold'>Form Fee</p>
                                        <div>{jobData.fees}₹</div>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <p className='text-white font-bold'>Last Submission Date</p>
                                    <p className=''>{new Date(jobData.lastSubmissionDate).toDateString()}</p>
                                </div>
                                <div className='flex flex-col justify-center items-center mt-2'>
                                    <p className='text-white font-bold'>Interview Date</p>
                                    <p>{new Date(jobData.interviewDate).toDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex flex-row justify-center items-center my-2 bg-amber-200 px-4 py-3 rounded-lg h-[150px] text-center w-[100%]'>{serverError}</div>
                }
            </div>
            }
        </div>
    )
}