"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../userLayout'
import { Vacancy } from '@prisma/client';
import { useRouter } from 'next/navigation'

export default function jobs() {
    const [jobList, setJobList] = useState<Vacancy[]>([])
    const router = useRouter()
    useEffect(() => {

        fetch('api/admin/getAllJobs', {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setJobList(data.data)

            }
        })
    }, [])
    return (
        <UserLayout>
            <div className=' w-full flex flex-row space-x-4 py-5 flex-wrap justify-center'>
                {jobList.map((item, index) => {
                    return (
                        <div className='w-[30vw] h-[270px] my-4 py-4 px-4 rounded-lg shadow-lg bg-amber-100 flex flex-col justify-between'>
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
        </UserLayout>
    )
}
