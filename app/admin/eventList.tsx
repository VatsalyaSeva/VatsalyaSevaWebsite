import { Events } from '@prisma/client'
import { useEffect, useState } from 'react'

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function EventList({ setPage, setNav }: props) {
    const [eventsList, setEvensList] = useState<Events[]>([])

    useEffect(() => {
        fetch('api/admin/getAllEvents', {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setEvensList(data.data)
            }
        })
    }, [])

    return (
        <div className="w-[70vw] h-[100vh]">
            {eventsList.length > 0 ?
                (
                    <div>
                        <div className='flex flex-row justify-between items-center'>
                            <p className="font-bold">Event</p>
                            {/* <p>{item.vacancyDescription}</p> */}
                            <div className="flex flex-row justify-between items-center space-x-4">
                                {/* <p className="font-bold">Date </p>
                                <p className="font-bold">Location</p> */}
                            </div>
                        </div>
                        {eventsList.map((item, index) => {
                            return (
                                <div key={index} className='flex flex-row justify-between items-center my-5'>
                                    <div className="space-x-2 flex flex-row items-center">
                                        <p>{index + 1}</p>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center space-x-8">
                                        <p>{new Date(item.date).toDateString()}</p>
                                        <p>{item.location}</p>
                                    </div>
                                    <p onClick={() => {
                                        fetch('/api/admin/deleteSingleEvent', {
                                            method: 'POST',
                                            body: JSON.stringify({
                                                eventId: item.id
                                            })
                                        }).then(res => res.json()).then(data => {
                                            fetch('api/admin/getAllEvents', {
                                                method: 'GET'
                                            }).then(res => res.json()).then(data => {
                                                if (data.status == 200) {
                                                    setEvensList(data.data)
                                                }
                                            })
                                        })
                                    }}>X</p>
                                </div>
                            )
                        })}
                    </div>
                )
                :
                <div className='h-[200px] flex flex-col justify-center'>
                    <p className="self-center">Events list is Empty</p>
                </div>
            }
        </div>
    )
}