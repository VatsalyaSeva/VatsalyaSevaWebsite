
import React from 'react'
import Slider from './slider'
import UserLayout from './userLayout'

export default function Home() {

    return (
        <UserLayout>
            <div className=''>
                <Slider />
                <div className='w-full bg-amber-100 self-end flex lg:flex-row flex-col items-center lg:px-10 lg:py-5 lg:space-x-10 space-y-3 px-2 py-5'>
                    <p className='lg:text-2xl sm:text-xl text-lg font-bold text-center self-center '>Contribution of Vatsalya Seva in National Service</p>
                    <div className=' lg:w-[10px] lg:h-[100px] w-1/2 h-[10px]  bg-amber-400'></div>
                    <p className='text_7 text-[12px] sm:text-sm text-center'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                </div>
                <div className='px-3 py-5 flex flex-col lg:flex-row justify-center items-center'>
                    <div className='lg:w-1/2 w-full grid place-content-center rounded-xl'>
                        <img
                            src={'/TransLogo.png'}
                            className={'w-full h-full'}
                        />
                    </div>
                    <div className='lg:w-1/2 w-full flex flex-col justify-center items-center space-y-3 lg:px-10 px-3'>
                        <p className='font-bold text-lg lg:text-xl text-center'>Our Vision, Our Mission</p>
                        <p className='text-center text-sm sm:text-base'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
