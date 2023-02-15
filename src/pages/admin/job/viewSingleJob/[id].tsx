"use client"
import { Vacancy,Applecants } from '@prisma/client';
import { SingleJobComponent } from '../../../../components/singleJobComponent'
import React,{ useState,useEffect, useCallback } from 'react';
import { Loader } from '../../../../components/loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from 'next';
import ReactHtmlParser from 'react-html-parser'; 
import { AppProps } from 'next/app';
import { api } from '../../../../utils/api';
import moment from 'moment';
viewSingleJob.getInitialProps = async (ctx) => {
    return { id:ctx.query.id }
}

export default function viewSingleJob(pageProp:AppProps['pageProps']){
    const [jobData,setJobData] = useState<Vacancy>({} as Vacancy)
    const [allApplicant,setAllApplicant] = useState<Applecants[]>([])
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [serverError,setServerError] = useState<string>('')
    const router = useRouter()

    const getSingleJob = api.vacancy.getById.useQuery({id:pageProp.id})
    useEffect(() => {
        if(getSingleJob.isSuccess){
            if(getSingleJob.data !=null){
                setJobData(getSingleJob.data)
            }
        }
    }, [getSingleJob.data])

    const getAllApplicants = api.applicants.getByJobId.useQuery({id:pageProp.id})

    useEffect(() => {
        if(getAllApplicants.isSuccess){
           setAllApplicant(getAllApplicants.data)
        }
    }, [getAllApplicants.data])
    

    return(
        <div className='container h-min-[100vh] w-[100vw] flex justify-center'>
            {isLoading ? <Loader isLoading={isLoading}/>:
            <div className='md:px-8 px-4 py-10 lg:w-[80vw] w-[100vw]'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-start space-x-4'>
                        <button className='flex flex-row items-center' onClick={()=> router.back()}>
                            <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                        </button>
                            <p className='md:text-xl text-lg font-bold '>{jobData.vacancyName}</p>
                    </div>
                    <button className="bg-green-700  text-white px-3 py-1 rounded-lg"
                        onClick={()=> router.push(`/admin/job/editSingleJob/${jobData.id}`)}
                    >Edit</button>
                </div>
                <div className='my-4 md:mx-8 mx-4'>
                    <div className=' '>
                        <div className=''>
                            
                            <p className=' mt-2 text-black'>Salary:  ₹{jobData.salary}</p>
                            <p className=' mt-2 text-black'>Form Fees: ₹{jobData.fees}</p>
                            <p className=' mt-2 text-black'>Job Count: {jobData.jobCount}</p>
                            <p className=' mt-2 text-black'>Job Location: {jobData.location}</p>
                            <div className='bg-pri px-4 py-4 my-4 rounded-lg flex flex-col justify-center'>
                                <p className=' text-black font-semibold'>Last Form Submission Date: {moment(jobData.lastSubmissionDate).format(' MMMM Do YYYY')}</p>
                                <p className=' mt-2 text-black'>Interview Date: {moment(jobData.interviewDate).format(' MMMM Do YYYY')}</p>
                            </div>
                            
                            <div className='py-2 text-md'>{ ReactHtmlParser(jobData.vacancyDescription)}</div>
                            <div>
                                <p className='text-2xl text-sec mb-4 mt-6'>All Applicants</p>
                                {allApplicant.length>0 ?
                                allApplicant.map((item,index)=>{
                                    return(
                                        <div key={index} className='flex flex-row justify-between items-center my-2 bg-tri px-4 py-3 rounded-lg'>
                                            <div>
                                                <p className='text-lg text-black font-bold'>{item.name}</p>
                                                <p className='text-sm text-black'>{item.phone}</p>
                                                <p className='text-sm text-black'>{item.email}</p>
                                            </div>
                                            <a 
                                                className='px-5 py-2 rounded-lg text-md bg-sec text-white font-bold'
                                                href={`/${item.cvFilePath}`} 
                                                target={'_blank'}>View CV</a>
                                        </div>
                                    )
                                }):<p className='flex flex-row justify-center items-center my-2 bg-tri px-4 py-3 rounded-lg h-[80px] text-center w-[100%]'>No Applicant found</p>}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            }
        </div>
    )
}