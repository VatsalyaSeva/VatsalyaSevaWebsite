import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../../../utils/api'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function CreateEvent({ setPage, setNav }: props) {

    let saveEventRequest = api.event.saveEvent.useMutation()

    const router = useRouter()

    const [eventName, setEventName] = useState<string>('')
    const [eventDateTime,setEventDateTime]  = useState<string>('')
    const [eventLocation, setEventLocation] = useState<string>('')
    const [eventDescription,setEventDescription] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = () => {
        saveEventRequest.mutate({
            name:eventName,
            location:eventLocation,
            dateTime:eventDateTime,
            description:eventDescription
        })
    }

    useEffect(()=>{
        if(saveEventRequest.isLoading){

        }
        if(saveEventRequest.isSuccess){
            router.back()
        }
    },[saveEventRequest.data])

    return (
        <div className='container md:px-8 px-4 py-5 flex justify-center w-[100vw]'>
            <div className='w-[80vw]'>
                <div className=' w-full flex justify-between items-center  md:mb-5 mb-3'>
                    <button className='flex flex-row items-center space-x-2' 
                        onClick={()=> router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} fontSize={20}/>
                        <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Create Event</p>
                    </button>
                    <button className="bg-green-700 md:text-md text-sm text-white px-3 py-1 rounded-lg"
                        onClick={()=> handleSubmit()}
                    >Submit</button>
                </div>
                <div className='w-full flex justify-center'>
                    <form
                        // encType='mu'
                        className='flex flex-col w-full'
                        >
                        
                        <p className="font-medium md:text-md text-sm py-1 mt-2 mb-1">Event name</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            name="name"
                            type='text'
                            placeholder='Event name'
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <p className="mt-2 mb-1 font-medium md:text-md text-sm py-1">Event Description</p>
                        <RichTextEditor onChange={setEventDescription} value={''}/>
                        <div className='flex md:space-x-4 md:flex-row flex-col md:items-center items-start mt-3'>
                            
                            <div>
                                <p className="mt-2 mb-1 font-medium md:text-md text-sm py-1">Event Date and Time</p>
                                <input
                                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                                    name="dateTime"
                                    type='datetime-local'
                                    placeholder='Event time'
                                    onChange={(e) => setEventDateTime(e.target.value)}
                                />

                            </div>

                        </div>
                        <p className="mt-2 mb-1 font-medium md:text-md text-sm py-1">Event Location</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            name="location"
                            type='text'
                            placeholder='Event location'
                            onChange={(e) => setEventLocation(e.target.value)}
                        />
                        
                    </form>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    )
}