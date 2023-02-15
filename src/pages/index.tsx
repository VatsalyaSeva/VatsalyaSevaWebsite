"use client"
import React, { useEffect, useState } from 'react'
import Slider from '../components/slider'
import { type NextPage } from "next";
import UserLayout from '../components/userLayout'
import { useRouter } from 'next/navigation'
import { Events, Vacancy } from '@prisma/client'
import moment from 'moment'
import Link from 'next/link'
import { api } from "../utils/api";

const Home:NextPage = ()=> {
    const router = useRouter()

    const [eventsList, setEvensList] = useState<typeof getEvent['data']>([])
    const [jobList, setJobList] = useState<Vacancy[]>([])
    // const getEvent = api.event.getAll.useQuery()

    // useEffect(()=>{
    //     if(getEvent.isSuccess){
    //         setEvensList(getEvent.data)
    //     }
    // },[getEvent.data])

    const getVacancyList = api.vacancy.getAll.useQuery()

    useEffect(()=>{
        if(getVacancyList.isSuccess){
            setJobList(getVacancyList.data)
        }
    },[getVacancyList.data])

    return (
        <UserLayout>
            <div className=''>
                <Slider />
                <div className='w-full bg-amber-100 self-end flex lg:flex-row flex-col items-center lg:px-10 lg:py-5 lg:space-x-10 space-y-3 px-2 py-5'>
                    <p className='lg:text-2xl sm:text-xl text-lg font-bold text-center self-center '>Contribution of Vatsalya Seva in National Service</p>
                    <div className=' lg:w-[10px] lg:h-[100px] w-1/2 h-[10px]  bg-amber-400'></div>
                    <p className='text_7 text-[12px] sm:text-sm text-center'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div>
                <div className='px-3 py-5 flex flex-col lg:flex-row justify-center items-center'>
                    <div className='lg:w-1/2 w-full grid place-content-center rounded-xl'>
                        <img
                            src={'/TransLogo.png'}
                            className={'w-full h-full'}
                        />
                    </div>
                    <div className='lg:w-1/2 w-full flex flex-col justify-center items-center space-y-3 lg:px-10 px-3'>
                        <p className='font-bold text-lg lg:text-xl text-center'>Our Vision, Our Mission</p>
                        <p className='text-center text-sm sm:text-base'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    </div>
                </div>
                <div className=' w-full px-5 py-5'>
                <div>
                    <p className='font-bold text-xl text-black py-3'>All Events</p>
                    <div className='grid grid-cols-5'>
                        {eventsList.map((item, index) => {
                            return (
                                <Link className='px-2' href={`/events/${item.id}`}>
                                    <img src={item.imagesUrl[0].image} className={'rounded-lg'} />
                                    <p className='font-bold pt-[8px] text-md'>{item.name}</p>
                                    <p className=' text-sm'>{new Date(item.date).toDateString()}</p>
                                </Link>
                            )
                        })}

                    </div>
                </div>
                <div className='mt-8'>
                    <p className='font-bold text-xl text-black py-1'>All Vacancy</p>
                    <div className='flex flex-row space-x-5'>
                        {jobList.map((item, index) => {
                            return (
                                <div className='w-[30vw] h-[270px] my-4 py-4 px-4 rounded-lg shadow-lg bg-gray-100 flex flex-col justify-between'>
                                    <div>
                                        <p className='font-medium text-lg'>{item.vacancyName}</p>
                                        <p className='text-sm pb-2'>{item.vacancyDescription.slice(0, 90)}</p>
                                        <div className='flex flex-row justify-between items-center pt-3 border-t-2 border-t-red-600'>
                                            <p className='text-sm font-medium text-gray-700'>Job Location</p>
                                            <p className='text-sm'>{item.location}</p>
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='text-sm font-medium text-gray-700'>Accepted Salary</p>
                                            <p className='text-sm'>{item.salary} ₹</p>
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='text-sm font-medium text-gray-700'>Total Posts</p>
                                            <p className='text-sm'>{item.jobCount}</p>
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='text-sm font-medium text-gray-700'>Application Last Date</p>
                                            <p className='text-sm'>{new Date(item.lastSubmissionDate).toDateString()}</p>
                                        </div>
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='text-sm font-medium text-gray-700'>Interview Date</p>
                                            <p className='text-sm'>{new Date(item.interviewDate).toDateString()}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-row justify-end space-x-3 items-center'>
                                        <p className='text-sm text-gray-700 font-medium'>Application Fees : {item.fees} ₹</p>
                                        <button className='bg-red-600 text-white px-5 py-1 rounded-lg' onClick={() => { router.push(`jobs/${item.id}`) }}>Apply</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
 
            </div>
            </div>
        </UserLayout>
    )
}

export default Home