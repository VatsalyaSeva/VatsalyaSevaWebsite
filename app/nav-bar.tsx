
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


export default function NavBar() {

    return (
        <div className='max-w-screen bg-amber-100 rounded-md flex flex-row justify-between items-center px-5 py-3'>
            <div className='space-x-3 flex flex-row items-center'>
                <Image
                    src="/TransLogo.png"
                    width={40}
                    height={40}
                    alt="logo"
                />
                <p className='sm:text-xl lg:text-2xl text-lg font-bold '>Vatsalya Seva </p>
            </div>
            <div className=' flex-row space-x-2 hidden sm:flex'>
                <Link className={`nav_link lg:text-lg`} href={'/'} prefetch={false} replace={false}>Home</Link>
                <Link className={`nav_link lg:text-lg`} href={'/donations'} prefetch={false} replace={false}>Donations</Link>
                <Link className={`nav_link lg:text-lg`} href={'/events'} prefetch={false} replace={false}>Events</Link>
                <Link className={`nav_link lg:text-lg`} href={'/jobs'} prefetch={false} replace={false}>Jobs</Link>

            </div>
        </div>
    )
}
