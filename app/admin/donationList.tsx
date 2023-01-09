import { Donation } from '@prisma/client';
import { useEffect, useState } from 'react';

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function DonationList({ setPage, setNav }: props) {
    const [donationList, setDonationList] = useState<Donation[]>([])

    useEffect(() => {
        fetch('api/admin/getAllDonations', {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setDonationList(data.data)
            }
        })
    }, [])
    return (
        <div className="w-[70vw] h-[100vh]">
            {donationList.length > 0 ?
                (
                    <div>
                        <div className='flex flex-row justify-between items-center'>
                            <p className="font-bold">Donator Name</p>
                            {/* <p>{item.vacancyDescription}</p> */}
                            <div className="flex flex-row justify-between items-center space-x-4">
                                <p className="font-bold">Amount </p>
                                <p className="font-bold">Status</p>
                            </div>
                        </div>
                        {donationList.map((item, index) => {
                            return (
                                <div key={index} className='flex flex-row justify-between items-center my-5'>
                                    <div className="space-x-2 flex flex-row items-center">
                                        <p>{index + 1}</p>
                                        {/* <p>{item.}</p> */}
                                    </div>
                                    <div className="flex flex-row justify-between items-center space-x-8">
                                        {/* <p>{item.salary}</p> */}
                                        {/* <p>{item.jobCount}</p> */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
                :
                <div className='h-[200px] flex flex-col justify-center'>
                    <p className="self-center">Donation list is Empty</p>
                </div>
            }
        </div>
    )
}
