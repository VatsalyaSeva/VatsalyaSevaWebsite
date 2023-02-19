import { faCalendar, faCoins, faFile, faImage, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useRouter } from 'next/navigation'  

export default function Admin() {
    const router = useRouter()

    return (
        <div className="container grid grid-rows-[1fr_300px] h-min-[100vh] w-[100vw] place-content-center">
            
            <div>
                <p className='text-xl my-2 font-medium'>Actions</p>
                <div className='grid grid-cols-2 md:grid-cols-5 self-center gap-x-5 gap-y-5 place-content-center'>
                    <div className='flex flex-col justify-center items-center bg-tri h-[100px] w-[100px] rounded-lg space-y-3' 
                    onClick={()=> router.replace('/admin/homeImages')}>
                        <FontAwesomeIcon icon={faImage} fontSize={30} color={'white'}/>
                        <p>Carousal</p>
                    </div>
                    
                    <div className='flex flex-col justify-center items-center bg-tri h-[100px] w-[100px] rounded-lg space-y-3' 
                    onClick={()=> router.replace('/admin/member')}>
                        <FontAwesomeIcon icon={faUser} fontSize={30} color={'white'}/>
                        <p>Members</p>
                    </div>
                    <div className='flex flex-col justify-center items-center bg-tri h-[100px] w-[100px] rounded-lg space-y-3'
                     onClick={()=> router.replace('/admin/job')}
                    >
                    <FontAwesomeIcon icon={faFile} fontSize={30} color={'white'}/>
                        <p>Vacancy</p>
                    </div>
                    <div className='flex flex-col justify-center items-center bg-tri h-[100px] w-[100px] rounded-lg space-y-3'
                     onClick={()=> router.replace('/admin/event')}
                    >
                    <FontAwesomeIcon icon={faCalendar} fontSize={30} color={'white'}/>
                        <p>Events</p>
                    </div>
                    <div className='flex flex-col justify-center items-center bg-tri h-[100px] w-[100px] rounded-lg space-y-3'
                     onClick={()=> router.replace('/admin/donation')}
                    >
                    <FontAwesomeIcon icon={faCoins} fontSize={30} color={'white'}/>
                        <p>Donations</p>
                    </div>
                </div>
            </div>
        </div>
    )
}