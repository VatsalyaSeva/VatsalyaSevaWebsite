"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const path = usePathname()
    console.log(path)
    return (
        <div className='max-w-screen bg-amber-100 rounded-md flex flex-row justify-between items-center px-5 py-3'>
            <div className='space-x-3 flex flex-row items-center'>
                <Image
                    src="/TransLogo.png"
                    width={40}
                    height={40}
                    alt="logo"
                />
                <p className='sm:text-xl lg:text-2xl text-sm font-bold '>Vatsalya Seva </p>
            </div>
            <div className='flex flex-row space-x-1 sm:space-x-2 '>
                <Link className={`nav_link lg:text-lg sm:px-3 hidden sm:block`} href={'/'} prefetch={false} replace={false}>Home</Link>
                <Link className={`nav_link lg:text-lg sm:px-3 hidden sm:block }`} href={'/donations'} prefetch={false} replace={false}>Donations</Link>
                <Link className={`nav_link lg:text-lg sm:px-3 hidden sm:block`} href={'/events'} prefetch={false} replace={false}>Events</Link>
                <Link className={`nav_link lg:text-lg sm:px-3 hidden sm:block`} href={'/jobs'} prefetch={false} replace={false}>Jobs</Link>
                <button className='donate_btn'>Donate Now</button>
            </div>
        </div>
    )
}
