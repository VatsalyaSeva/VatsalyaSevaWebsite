"use client"
import React, { useEffect, useState } from 'react'

export const slideImage = [
    '/slider/img63.jpg',
    '/slider/img66.jpg',
    '/slider/img67.jpg',
    '/slider/img68.jpg',
    '/slider/img69.jpg',
    '/slider/img70.jpg',
    '/slider/img71.jpg',
    '/slider/img72.jpg',
    '/slider/img73.jpg',
    '/slider/img74.jpg',
    '/slider/img75.jpg',
    '/slider/img76.jpg',
    '/slider/img77.jpg',
    '/slider/img78.jpg',
    '/slider/img79.jpg',
    '/slider/img80.jpg',
    '/slider/img81.jpg',
    '/slider/img82.jpg',
]

export default function Slider() {
    const images = slideImage
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            if (activeIndex == images.length - 1) {
                setActiveIndex(0)
            }
            else {
                setActiveIndex(activeIndex + 1)
            }

        }, 2000);
    }, [activeIndex])

    return (
        <div>
            <img
                src={images[activeIndex]}
                className={'w-full object-cover h-[550px]'}
            />
        </div>
    )
}
