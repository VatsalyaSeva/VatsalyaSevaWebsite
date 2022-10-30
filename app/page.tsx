"use client"
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useWindowSize } from 'react-use';
import usePath from '../store'
import { useRouter } from 'next/router';

export default function Home() {
    // const { width, height } = useWindowSize();
    const images = [
        '/slider/sansthan pdf_page-0014.jpg',
        '/slider/sansthan pdf_page-0004.jpg',
        '/slider/sansthan pdf_page-0005.jpg',
        '/slider/sansthan pdf_page-0006.jpg',
        '/slider/sansthan pdf_page-0007.jpg',
        '/slider/sansthan pdf_page-0008.jpg',
        '/slider/sansthan pdf_page-0009.jpg',
        '/slider/sansthan pdf_page-0010.jpg',
        '/slider/sansthan pdf_page-0011.jpg',
        '/slider/sansthan pdf_page-0012.jpg',
        '/slider/sansthan pdf_page-0013.jpg',
        '/slider/sansthan pdf_page-0001.jpg',
        '/slider/sansthan pdf_page-0015.jpg',
        '/slider/sansthan pdf_page-0016.jpg',
        '/slider/sansthan pdf_page-0017.jpg',
        '/slider/sansthan pdf_page-0018.jpg',
        '/slider/sansthan pdf_page-0019.jpg',
        '/slider/sansthan pdf_page-0020.jpg',

    ]
    const [currentIndex, setCurrentIndex] = useState<number>(2)

    const updateP = usePath((state) => state.updatePath)

    useEffect(() => {
        // getRoute()
        // updateP(router.pathname)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (currentIndex == images.length - 1) {
                setCurrentIndex(0)
            }
            else {
                setCurrentIndex(currentIndex + 1)
            }
        }, 2000);
    }, [currentIndex])

    return (
        <div className='w-full h-[530] my-5 rounded-lg overflow-hidden relative' >
            <img
                src={images[currentIndex]}
                alt={'Hero Image'}
                className="object-cover w-full "
                style={{ height: '530px' }}
            />
            <div className='bg-gradient-to-b from-[transparent] to-gray-900 absolute w-full h-full flex flex-col items-end justify-end px-10 py-10' style={{ zIndex: 3, top: '0px' }}>
                <p className='text-white lg:text-2xl font-bold'>Let's Make a Change together</p>
                <button className='bg-white px-5 py-2 mt-4 rounded-lg text-sm font-bold'>Donate Now</button>
            </div>
        </div>
    )
}
