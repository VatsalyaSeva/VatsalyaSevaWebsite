"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../userLayout'
import { useRouter } from 'next/navigation';
import { Vacancy,Events,Image,Video } from '@prisma/client';
import { AppProps } from 'next/app';
export default function events(pageProps:AppProps['pageProps']) {
    type SingleEventType =  Events & {imagesUrl: Image[];videoUrl: Video[];}

    const [singleEvent,setSingleEvent] = useState<SingleEventType>({} as SingleEventType)
    const [isLoading,setIsLoading] = useState(false)

    const getSingleEvent = () =>{
        setIsLoading(true)
        fetch(`/api/user/getSingleEvent?id=${pageProps.params.id}`, {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setSingleEvent(data.data)
                setIsLoading(false)
            }
            else{
                setIsLoading(false)
            }
        })
    }

    useEffect(()=>{
        // console.log(props)
        getSingleEvent()
    },[])

    return (
        <UserLayout>
            {isLoading ? <div></div>:
            <div className='px-2' >
                    <p className='font-bold pt-[8px] text-2xl my-3'>{singleEvent.name}</p>
                    {/* <p className=' text-sm'>{new Date(singleEvent.date).toDateString()}</p> */}
                <div className='grid grid-cols-3'>
                    {singleEvent.imagesUrl && singleEvent.imagesUrl.map((item,index)=>{
                        return(
                            <img src={`/${item.image}`} className={'rounded-lg '} />
                        )                    
                    })}
                </div>
            </div>
            }
        </UserLayout>
    )
}
