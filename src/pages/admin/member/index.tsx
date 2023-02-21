

import React, { use, useEffect, useState } from 'react'
import { api } from '../../../utils/api'
import { Member } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from '../../../server/api/trpc'

export default function Members() {
    const getAllMembers = api.member.getAll.useQuery()
    const deleteMember = api.member.deleteById.useMutation()
    const router = useRouter()

    const [members,setMembers] = useState<Member[]>([])

    useEffect(()=>{
        if(getAllMembers.isSuccess){
            setMembers(getAllMembers.data)
            
        }
    },[getAllMembers.data])

    useEffect(()=>{
        if(deleteMember.isSuccess){
            getAllMembers.refetch()
        }
    },[deleteMember.data])
    
    return (getAllMembers.isLoading ?
        <div className="grid place-content-center h-[400px] w-[100vw] ">
            <p className="font-bold text-xl text-black">Loading Data...</p>
        </div> :
        <div className="w-[100vw] h-min-[100vh] md:px-8 px-4 py-5">
            <div className="flex justify-between items-center mb-8">
                <button className='flex flex-row items-center space-x-2' onClick={()=> router.replace('/admin/dashboard')}>
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={20}/>
                    <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Dashboard</p>
                </button>
                <button className="text-green-900 text-sm md:text-md"
                    onClick={()=> router.push('/admin/member/createMember')}
                >Create New</button>
            </div>
            <div className="space-y-1">
                {members.length > 0 ?
                    members.map((item, index) => {
                        return (
                            <div className="flex justify-between items-center" key={index}>
                                <div className="flex flex-row items-center space-x-3">
                                    <p className="font-semibold">{index + 1}.</p>
                                    {item.profilePicUrl && <img src={item.profilePicUrl} alt="" className='h-[30px] w-[30px] rounded-xl' />}
                                    <p className="text-md">{item.name}</p>

                                </div>
                                <div className="flex flex-row justify-end items-center space-x-2 ">
                                    <button className="text-sm md:text-md bg-green-500 text-white px-3 py-1 rounded-lg" 
                                        onClick={()=> router.push(`/admin/member/viewSingleMember/${item.id}`)}
                                        >View</button>
                                    <button className="text-sm md:text-md bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                        onClick={()=> router.push(`/admin/member/editSingleMember/${item.id}`)}

                                    >Edit</button>
                                    <button
                                        onClick={() => deleteMember.mutate({id:item.id})}
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

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
  }) {
    const user = req.session.user;
  
    if (!user?.isLoggedIn) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  },
  sessionOptions);


