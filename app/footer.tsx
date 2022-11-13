import React from 'react'

export default function Footer() {
    return (
        <div className='bg-amber-100 w-full  px-2 space-y-5 rounded-tl-[50px] mt-[50px] rounded-tr-[50px]'>
            <div className='py-7 border-b-[2px] border-red-800 w-full flex sm:flex-row flex-col justify-center items-center space-x-3 space-y-3'>
                <p className='font-semibold text-lg'>Donate to Vatsalya Seva Santhan</p>
                <button className='flex flex-row justify-center items-center'>
                    <p className='border-2 rounded-tl-lg rounded-bl-lg border-red-500 px-5 py-2'>5000₹</p>
                    <p className='bg-red-500 px-3 py-2 text-white rounded-tr-lg rounded-br-lg'>Donate</p>
                </button>
            </div>
            <div className='w-full flex sm:flex-row flex-col align-center px-10 pb-5 space-y-5'>
                <div className='lg:w-1/3 flex flex-col items-center'>
                    <p className=' text-lg font-semibold text-red-800'>Contact Address</p>
                    <p className='text-center'>Vatsalya Seva Sansthan, Sector 6, Savina Udaipur (Rajasthan)- 313001</p>
                </div>
                <div className=' lg:w-1/3 flex flex-col items-center'>
                    <p className='text-lg font-semibold text-red-800'>Contact Details</p>
                    <p>Contact no.  +91 XXXXXXXXXX</p>
                    <p>Whatsapp no. +91 XXXXXXXXXX</p>
                    <p>Mail address. info@vatsalyaseva.org</p>
                </div>
                <div className='space-y-2 lg:w-1/3 flex flex-col items-center '>
                    <p className='text-lg font-semibold text-red-800'>Quick Links</p>
                    <p className=''>Donations</p>
                    <p>Events</p>
                    <p>Jobs</p>
                    <p>FAQs</p>
                    <p>Privacy Police</p>

                </div>
            </div>
        </div>
    )
}
