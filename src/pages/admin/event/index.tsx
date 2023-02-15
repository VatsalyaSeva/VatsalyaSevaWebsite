import { Events } from '@prisma/client'
import { useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function EventList({ setPage, setNav }: props) {
    const [eventsList, setEvensList] = useState<Events[]>([])
    const getAllEvent = api.event.getAll.useQuery()
    const router = useRouter()
    
    useEffect(()=>{
        if(getAllEvent.isSuccess){
            setEvensList(getAllEvent.data)
        }
    },[getAllEvent.data])

    return (
        <div className="container w-[100vw] h-min-[100vh] px-8 py-5">
            <div className="flex justify-between items-center mb-8">
                <button className='flex flex-row items-center space-x-2' onClick={()=> router.replace('/admin')}>
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                    <p className='text-xl font-bold py-2 items-center mr-3'>Dashboard</p>
                </button>
                <button className="text-green-900 "
                    onClick={()=> router.push('/admin/event/createEvent')}
                >Create New</button>
            </div>
            <div>
                {eventsList.length > 0 ?
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
                                    
                                    <div className="flex flex-row justify-end items-center space-x-2 ">
                                        <button className="text-sm md:text-md bg-green-500 text-white px-3 py-1 rounded-lg" 
                                            onClick={()=> router.push(`/admin/event/viewSingleEvent/${item.id}`)}>View</button>
                                        <button className="text-sm md:text-md bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                            onClick={()=> router.push(`/admin/event/editSingleEvent/${item.id}`)}
                                        >Edit</button>
                                        <button
                                            onClick={() => {}}
                                            className="bg-red-500 text-sm md:text-md text-white px-3 py-1 rounded-lg">Delete
                                        </button>
                                    </div>
                                    
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className='h-[200px] flex flex-col justify-center'>
                        <p className="self-center">Events list is Empty</p>
                    </div>
                }
            </div>
        </div>
    )
}