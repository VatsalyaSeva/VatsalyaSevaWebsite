

import React, { use, useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { Member } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

export default function Members() {
    let getAllMembers = api.member.getAll.useQuery()
    let router = useRouter()

    const [members,setMembers] = useState<Member[]>([])

    useEffect(()=>{
        if(getAllMembers.isSuccess){
            setMembers(getAllMembers.data)
        }
    },[getAllMembers.data])
    
    return (getAllMembers.isLoading ?
        <div className="grid place-content-end">
            <p className="font-bold text-xl text-black">Loading Data...</p>
        </div> :
        <div className="w-[100vw] h-min-[100vh] md:px-8 px-4 py-5">
            <div className="flex justify-between items-center mb-8">
                <button className='flex flex-row items-center space-x-2' onClick={()=> router.replace('/admin')}>
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={20}/>
                    <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Dashboard</p>
                </button>
                <button className="text-green-900 text-sm md:text-md"
                    onClick={()=> router.push('/admin/member/addNewMember')}
                >Create New</button>
            </div>
            <div className="space-y-1">
                {members.length > 0 ?
                    members.map((item, index) => {
                        return (
                            <div className="grid md:grid-cols-2 grid-rows-2 gap-1 md:gap-0 " key={index}>
                                <div className="flex flex-row justify-start items-start space-x-3">
                                    <p className="font-semibold">{index + 1}.</p>
                                    <p className="text-md">{item.name}</p>

                                </div>
                                <div className="flex flex-row justify-end items-center space-x-2 ">
                                    <button className="text-sm md:text-md bg-green-500 text-white px-3 py-1 rounded-lg" 
                                        // onClick={()=> router.push(`/admin/job/viewSingleJob/${item.id}`)}
                                        >View</button>
                                    <button className="text-sm md:text-md bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                        // onClick={()=> router.push(`/admin/job/editSingleJob/${item.id}`)}

                                    >Edit</button>
                                    <button
                                        // onClick={() => deleteMember.mutate({id:item.id})}
                                        className="bg-red-500 text-sm md:text-md text-white px-3 py-1 rounded-lg">Delete
                                    </button>
                                </div>
                            </div>
                        )
                    }) :
                    <div className="h-[200px]">
                        <p>No Record Found</p>
                    </div>
                }
            </div>
        </div>
    )
}