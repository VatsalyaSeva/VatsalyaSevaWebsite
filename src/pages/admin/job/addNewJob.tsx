import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import React,{ useState, FC, FormEvent, useEffect } from "react"
import {useRouter} from "next/navigation";
import { api } from "../../../utils/api";
import Lottie from "lottie-react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../server/api/trpc";

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

export default function CreateJobs() {

    const router = useRouter()
    const createVacancy = api.vacancy.createRecord.useMutation()
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [jobCount, setJobCount] = useState<string>('0')
    const [salary, setSalary] = useState<string>('0')
    const [lastSubmissionDate, setLastSubmissionDate] = useState<string>('')
    const [interviewDate, setInterviewDate] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [applicationFee, setApplicationFee] = useState<string>('0')

    useEffect(()=>{
        if(createVacancy.isSuccess){
            router.back()
        }
    },[createVacancy.data])

    const handleSubmit = () => {
        createVacancy.mutate({
            vacancyName: name,
            vacancyDescription: description,
            jobCount: parseInt(jobCount),
            salary: parseInt(salary),
            interviewDate: interviewDate,
            lastSubmissionDate: lastSubmissionDate,
            location: location,
            fees: parseInt(applicationFee),

        })
    }

    return (createVacancy.isLoading ?
        <div className="grid place-content-center h-[400px] w-[100vw]">
            <Lottie 
                animationData={require('../../../../public/lottie/loading.json')}
                className='h-[50px] w-[50px]'
            />
        </div> :
        <div className="container w-[100vw] flex justify-center">
            <div className=' md:w-[70vw] w-[90vw]  md:px-8 px-4  py-8 flex flex-col items-center '>
                <div className='flex justify-between items-center w-full mb-5'>
                    <button className='flex flex-row items-center space-x-2' onClick={()=> router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                        <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Create New</p>
                    </button>
                    <button className="text-sm md:text-md bg-green-700  text-white px-3 py-1 rounded-lg"
                        onClick={()=> handleSubmit()}
                    >Submit</button>
                </div>
                <form
                    className='flex flex-col w-full'
                    >
                    
                    <p className="font-medium md:text-md text-sm py-1">Job Name</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='text'
                        placeholder='Job name'
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Job description</p>
                    
                    <RichTextEditor onChange={setDescription} value={''}/>
                    
                    <p className="font-medium md:text-md text-sm py-1">Job location</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="address"
                        type='text'
                        required
                        placeholder='Job location'
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Post Count</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='number'
                        required
                        placeholder='Post Count'
                        onChange={(e) => setJobCount(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Job Salary</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="name"
                        type='number'
                        required
                        placeholder='Job Salary'
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Form Fees</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        name="number"
                        type='text'
                        required
                        placeholder='Form Fees'
                        onChange={(e) => setApplicationFee(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Last Apply Date</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                        name="date"
                        type='date'
                        required
                        placeholder='Last Apply Date'
                        onChange={(e) => setLastSubmissionDate(e.target.value)}
                    />
                    <p className="font-medium md:text-md text-sm py-1">Interview Date</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                        name="date"
                        type='date'
                        required
                        placeholder='Interview Date'
                        onChange={(e) => setInterviewDate(e.target.value)}
                    />
                    
                </form>
                
            </div>
        </div>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
  }) {
    const user = req.session.user;
  
    if (!user?.isLoggedIn) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  },
  sessionOptions);