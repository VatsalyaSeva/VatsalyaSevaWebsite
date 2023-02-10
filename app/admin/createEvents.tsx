import { FormEvent, useState } from 'react'

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function CreateEvent({ setPage, setNav }: props) {

    const [eventName, setEventName] = useState<string>('')
    const [eventDate, setEventDate] = useState<string>('')
    const [eventLocation, setEventLocation] = useState<string>('')
    const [eventImage, setEventImage] = useState<Blob[]>([])
    const [eventVideo, setEventVideo] = useState<Blob[]>([])
    const [error, setError] = useState<string>('')

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let formData = new FormData();

        formData.append('eventName', eventName)
        formData.append('eventDate', eventDate)
        formData.append('eventLocation', eventLocation)
        for (let i = 0; i < eventImage.length; i++) {
            formData.append("eventImages", eventImage[i]);
        }

        for (let i = 0; i < eventVideo.length; i++) {
            formData.append("eventImages", eventVideo[i]);
        }

        setError('sending')
        fetch('/api/admin/saveNewEvent', {
            method: 'POST',
            headers: { 'Access-Control-Allow-Headers': '*' },
            body: formData
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setError(data.message)
                setEventDate('')
                setEventLocation('')
                setEventName('')
                setEventVideo([])
                setEventImage([])
            }
            else {
                setError('Event not created')
            }
        })
    }

    return (
        <div className=' '>
            <form
                // encType='mu'
                className='flex flex-col'
                onSubmit={(e) => handleSubmit(e)}>
                <p className='text-xl font-bold text-black my-5 self-center'>New Event</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="name"
                    type='text'
                    placeholder='Event name'
                    onChange={(e) => setEventName(e.target.value)}
                />
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="date"
                    type='date'
                    placeholder='Event date'
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="location"
                    type='text'
                    placeholder='Event location'
                    onChange={(e) => setEventLocation(e.target.value)}
                />
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="files"
                    type='file'
                    placeholder='Event Images'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                        setEventImage(e.target.files)
                    }}
                />
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                    name="videos"
                    type='file'
                    placeholder='Event Videos'
                    accept='video/*'
                    multiple
                    onChange={(e) => {
                        setEventVideo(e.target.files)
                    }}
                />
                <button
                    type='submit'
                    className='px-4 py-1 rounded-md bg-amber-600 w-full text-white'>Create</button>
            </form>
            <p>{error}</p>
        </div>
    )
}