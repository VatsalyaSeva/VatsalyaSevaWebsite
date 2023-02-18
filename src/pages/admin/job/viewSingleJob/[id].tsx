"use client"
import { Applicant, Vacancy } from '@prisma/client';
import React,{ useState,useEffect, useCallback } from 'react';
import { Loader } from '../../../../components/loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft, faTrash} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { GetServerSideProps } from 'next';
import ReactHtmlParser from 'react-html-parser'; 
import { AppProps } from 'next/app';
import { api } from '../../../../utils/api';
import moment from 'moment';
import Lottie from 'lottie-react';
import { useFilePicker } from 'use-file-picker';
import { sanityClient } from '../../../../server/storage';
import { basename } from 'path';


viewSingleJob.getInitialProps = async (ctx: { query: { id: any; }; }) => {
    return { id:ctx.query.id }
}

export default function viewSingleJob(pageProp:AppProps['pageProps']){
    type vacancy = Vacancy & {
        applecants: Applicant[];
    }
    const [jobData,setJobData] = useState<vacancy>({} as vacancy)
    const addQRCode = api.vacancy.addQRCode.useMutation()
    const removeQRCode = api.vacancy.removeQRCode.useMutation()
    const router = useRouter()
    let [openFileSelector, { filesContent, loading,errors,clear }] = useFilePicker({
        accept:'image/*',
        multiple:false,
        readAs:'ArrayBuffer',
        maxFileSize:4,
    })

    useEffect(()=>{
        if(filesContent.length>0 && !errors[0]?.fileSizeToolarge){
            let file = filesContent[0]
            if(file){
                let n = Buffer.from(file.content)
                sanityClient.assets.upload('image',n,{
                    filename: basename(file.name)
                }).then(data =>{
                    addQRCode.mutate({
                        vacancyId:pageProp.id,
                        qrCodePath:data._id,
                        qrCodePathUrl:data.url
                    })
                })
    
            }
        }
    },[filesContent,errors])

    const getSingleJob = api.vacancy.getById.useQuery({id:pageProp.id,applicant:true})
    useEffect(() => {
        if(getSingleJob.isSuccess){
            if(getSingleJob.data !=null){
                setJobData(getSingleJob.data)
            }
        }
    }, [getSingleJob.data])


    useEffect(() => {
        if(addQRCode.isSuccess){
            if(getSingleJob.data !=null){
                setJobData({
                    ...jobData,
                    qrCodePath:getSingleJob.data.qrCodePath,
                    qrCodePathUrl:getSingleJob.data.qrCodePathUrl
                })
            }
        }
    }, [addQRCode.data])

    useEffect(() => {
        if(removeQRCode.isSuccess){
            if(removeQRCode.data !=null){
                setJobData({
                    ...jobData,
                    qrCodePath:removeQRCode.data.qrCodePath,
                    qrCodePathUrl:removeQRCode.data.qrCodePathUrl
                })
            }
        }
    }, [removeQRCode.data])
    

    return(
        <div className='container h-min-[100vh] w-[100vw] flex justify-center'>
            {getSingleJob.isLoading ? 
            <div className='grid place-content-center h-[400px] w-[100vw]'>
                <Lottie 
                animationData={require('../../../../../public/lottie/loading.json')}
                className='h-[50px] w-[50px]'
            />
            </div>:
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
                {Object.keys(jobData).length>0 && <div className='my-4 md:mx-8 mx-4'>
                    <div className=' '>
                        <div className=''>
                            <div className='w-full flex items-center space-x-5'>
                                <div className='h-full '>
                                    {jobData.qrCodePathUrl?
                                        <div className='relative border'>
                                            <img src={jobData.qrCodePathUrl} className='h-[200px] w-[180px] rounded-lg' />
                                            <div className='absolute z-[3px] top-[10px] right-[10px]'>
                                                <FontAwesomeIcon 
                                                    icon={faTrash} 
                                                    fontSize={20} 
                                                    color={'red'}
                                                    onClick={()=> removeQRCode.mutate({
                                                        vacancyId:pageProp.id,
                                                        qrCodePath:jobData.qrCodePath ? jobData.qrCodePath:''
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        :
                                        <div className='grid place-content-center h-[200px] w-[180px] rounded-lg bg-tri'>
                                            <button className='text-white text-sm bg-sec px-3 py-1 rounded-md'
                                                onClick={()=>openFileSelector()}
                                            >Add QR</button>
                                        </div>

                                    }
                                </div>
                                <div>
                                    <p className=' mt-2 text-black'>Vacancy ID:{jobData.id}</p>
                                    <p className=' mt-2 text-black'>Salary:  ₹{jobData.salary}</p>
                                    <p className=' mt-2 text-black'>Form Fees: ₹{jobData.fees}</p>
                                    <p className=' mt-2 text-black'>Job Count: {jobData.jobCount}</p>
                                    <p className=' mt-2 text-black'>Job Location: {jobData.location}</p>
                                    <p className=' mt-2 text-black'>Job Created: {`${jobData.createdAt}`}</p>
                                </div>
                            </div>
                            <div className='bg-pri px-4 py-4 my-4 rounded-lg flex flex-col justify-center'>
                                <p className=' text-black font-semibold'>Last Form Submission Date: {moment(jobData.lastSubmissionDate).format(' MMMM Do YYYY')}</p>
                                <p className=' mt-2 text-black'>Interview Date: {moment(jobData.interviewDate).format(' MMMM Do YYYY')}</p>
                            </div>
                            
                            <div className='py-2 text-md'>{ ReactHtmlParser(jobData.vacancyDescription)}</div>
                            <div>
                                <p className='text-2xl text-sec mb-4 mt-6'>All Applicants</p>
                                {jobData.applecants.length>0 ?
                                jobData.applecants.map((item,index)=>{
                                    return(
                                        <div key={index} className='flex flex-row justify-between items-center my-2 bg-tri px-4 py-3 rounded-lg'>
                                            <div>
                                                <p className='text-lg text-black font-bold'>{item.name}</p>
                                                <p className='text-sm text-black'>{item.id}</p>
                                                <p className='text-sm text-black'>{item.upiId}</p>
                                                <p className='text-sm text-black'>{item.phone}</p>
                                                <p className='text-sm text-black'>{item.email}</p>
                                            </div>
                                            <a 
                                                className='px-5 py-2 rounded-lg text-md bg-sec text-white font-bold'
                                                href={item.cvFilePathUrl} 
                                                target={'_blank'}>View CV</a>
                                        </div>
                                    )
                                }):<p className='flex flex-row justify-center items-center my-2 bg-tri px-4 py-3 rounded-lg h-[80px] text-center w-[100%]'>No Applicant found</p>}
                            </div>
                        </div>
                        
                    </div>
                </div>}
            </div>
            }
        </div>
    )
}