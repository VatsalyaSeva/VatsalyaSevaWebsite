"use client"
import React, { useState } from 'react'
import UserLayout from '../../components/userLayout'

export default function Donations() {
    const [isIndia, setIsIndia] = useState<boolean>(true)
    return (
        <UserLayout>
            <div className=' w-full flex flex-col pt-5 pb-5 justify-center items-center'>
                <div className='my-5'>
                    <button onClick={() => setIsIndia(true)} className={`px-5 py-2 text-lg bg-amber-100 rounded-lg ${isIndia ? 'bg-red-400 text-white text-bold border-black' : 'text-black'} `}>India</button>
                    <button onClick={() => setIsIndia(false)} className={`px-5 py-2 text-lg bg-amber-100 rounded-lg ${!isIndia ? 'bg-red-400 text-white text-bold border-black' : 'text-black'} `}>Out of India</button>
                </div>
                {isIndia ?
                    <div className='flex flex-col'>

                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'text'} placeholder={'Enter full name'} />
                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'email'} placeholder={'Email Address'} />
                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'tel'} placeholder={'Enter Mobile Number'} />
                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'text'} placeholder={'Address Line 1'} />
                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'text'} placeholder={'Address Line 2'} />
                        <input className={'bg-amber-100 rounded-xl px-4 py-2 text-black placeholder:text-black my-2'} type={'number'} placeholder={'Postal Code'} max={6} />
                    </div> :
                    <div className={'h-[200px] flex flex-col justify-center'}>
                        <p>Coming Soon</p>
                    </div>
                }
            </div>
        </UserLayout>
    )
}
