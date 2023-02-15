"use client"
import React, { useEffect, useState } from 'react'
import UserLayout from '../../components/userLayout'
import { Events,Image,Video } from '@prisma/client'
import moment from 'moment'
import { api } from '../../utils/api'

export default function events() {
    type SingleEventType =  Events & {imagesUrl: Image[];videoUrl: Video[];isUpcoming:boolean}
    const [eventsList, setEvensList] = useState<SingleEventType[]>([])

    const getAllEvents = api.event.getAll.useQuery()
    let today = moment(new Date())

    useEffect(() => {
        if(getAllEvents.isSuccess){
            
            setEvensList(getAllEvents.data.map((item) => {
                if (moment(item.date).isAfter(today)) {
                    return { ...item, isUpcoming: true }
                }
                else {
                    return { ...item, isUpcoming: false }
                }
            }))
        }
    }, [getAllEvents.data])


    return (
        <UserLayout>
            <div className=' w-full px-5 py-5'>
                <div>
                    <p className='font-bold text-xl text-black py-3'>Upcoming Events</p>
                    <div className='flex flex-row space-x-5'>
                        {eventsList.map((item, index) => {
                            return (item.isUpcoming &&
                                <div className='px-2'>
                                    <img src={item.imagesUrl[0].image} className={'w-[220px] h-[250px] rounded-lg'} />
                                    <p className='font-bold pt-2'>{item.name}</p>
                                    <p className='pt-1'>{new Date(item.date).toDateString()}</p>
                                </div>
                            )
                        })}

                    </div>
                </div>
                <div>
                    <p className='font-bold text-xl text-black py-3'>Previous Events</p>
                    {eventsList.map((item, index) => {
                        return (!item.isUpcoming &&
                            <div className='px-2'>
                                <img src={item.imagesUrl[0].image} className={'w-[220px] h-[250px] rounded-lg'} />
                                <p className='font-bold pt-2'>{item.name}</p>
                                <p className='pt-1'>{new Date(item.date).toDateString()}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </UserLayout>
    )
}
