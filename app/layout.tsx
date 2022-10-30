
import '../styles/globals.css'
import Image from 'next/image'
import usePath from '../store'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const path = usePath((state) => state.currentPathName)

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className='bg-white'>
        <div className="my-5 mx-5">
          <div className=' bg-orange-200 px-5 py-3  rounded-lg flex justify-between items-center shadow-lg'>
            <div className='width=[200]'>
              <Image src={'/logos/placeholderlogo.png'} alt={''} height={50} width={50} className="xs:w-[40] xs:h-[40]" />
            </div>
            <div className='flex items-center'>
              <p className='md:text-lg sm:text-sm xs:text-[12px] text-black mx-2'>Home</p>
              <p className='md:text-lg sm:text-sm xs:text-[12px] text-black mx-2'>Donations</p>
              <p className='md:text-lg sm:text-sm xs:text-[12px] text-black mx-2'>Events</p>
              <p className='md:text-lg sm:text-sm xs:text-[12px] text-black mx-2'>Jobs</p>
              <p className='md:text-lg sm:text-sm xs:text-[12px] text-black mx-2'>Members</p>

            </div>

          </div>
          {children}
        </div>

      </body>
    </html>
  )
}
