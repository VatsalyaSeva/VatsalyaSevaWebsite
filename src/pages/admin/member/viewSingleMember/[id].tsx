
import { Vacancy, Member } from '@prisma/client';
import React,{ useState,useEffect, useCallback } from 'react';
import { Loader } from '../../../../components/loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faDeleteLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";

import { AppProps } from 'next/app';
import { api } from '../../../../utils/api';
import { useFilePicker } from 'use-file-picker';
import { sanityClient } from '../../../../server/storage';
import { basename } from 'path';
import { sessionOptions } from '../../../../server/api/trpc';
import { withIronSessionSsr } from 'iron-session/next';

ViewSingleMember.getInitialProps = async (ctx: { query: { id: string; }; }) => {
    return { id:ctx.query.id }
}

export default function ViewSingleMember(pageProp:AppProps['pageProps']){

    const router = useRouter()
    const [member,setMember] = useState<Member>({} as Member)
    const getSingleMember = api.member.getById.useQuery({id:pageProp.id})
    const removeProfile = api.member.deleteProfilePic.useMutation()
    const updateProfilePic = api.member.updateProfilePic.useMutation()
    

    const [openFileSelector, { filesContent, loading }] = useFilePicker({
        readAs: 'ArrayBuffer',
        accept: 'image/*',
        multiple: false,
        maxFileSize:2
      });

    useEffect(() => {
        if(getSingleMember.isSuccess){
            if(getSingleMember.data !=null){
                setMember(getSingleMember.data)
            }
        }
    }, [getSingleMember.data])

    useEffect(() => {
        if(removeProfile.isSuccess){
            getSingleMember.refetch()
        }
    }, [removeProfile.data])

    useEffect(() => {
        if(updateProfilePic.isSuccess){
            getSingleMember.refetch()
        }
    }, [updateProfilePic.data])

    useEffect(()=>{
        if(filesContent.length>0){
            const filePath = filesContent[0]
            if(filePath){
                const n  = Buffer.from(filePath.content)

                if(typeof(member.profilePic) == 'string'){
                    sanityClient.delete(member.profilePic)
                }

                sanityClient.assets.upload(
                    'image', n, {
                        filename: basename(filePath.name)
                    }
                ).then(data=>{
                    updateProfilePic.mutate({
                        id:pageProp.id,
                        profilePic:data._id,
                        profilePicUrl:data.url
                    })
                })
            }
        }
    },[filesContent])

    return(
        <div className='container h-min-[100vh] w-[100vw] flex justify-center'>
            {getSingleMember.isLoading ? 
                <Loader isLoading={getSingleMember.isLoading}/>:
                <div className='md:px-8 px-4 py-10 lg:w-[80vw] w-[100vw]'>
                    <div className='flex justify-between items-start'>
                        <div className='flex items-start space-x-4'>
                            <button className='flex flex-row items-center' onClick={()=> router.back()}>
                                <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                            </button>
                                <p className='md:text-xl text-lg font-bold '>Members</p>
                        </div>
                        <button className="bg-green-700  text-white px-3 py-1 rounded-lg"
                            onClick={()=> router.push(`/admin/member/editSingleMember/${member.id}`)}
                        >Edit</button>
                    </div>
                    {Object.keys(member).length>0 && 
                    <div className='w-full flex flex-col justify-center items-center h-full'>
                        <div className='h-[200px] w-[200px] relative'>
                            {member.profilePicUrl ?
                                <img src={member.profilePicUrl} className='rounded-xl w-full h-full' />
                                :<div className=' w-full h-full rounded-xl grid place-content-center bg-tri'>
                                    <p className='text-4xl font-bold text-white w-full h-full'>{member.name.slice(0,2)}</p>
                                </div>
                            }
                            <div className="top-[10px] right-[10px] absolute z-[2px] space-x-2">
                                <button className=" bg-green-500 px-2 py-1 rounded-md"
                                   onClick={()=> openFileSelector()}
                                >
                                    <FontAwesomeIcon icon={faEdit} color='white' fontSize={15}/>
                                </button>
                                {member.profilePic && <button className=" bg-red-500 px-2 py-1 rounded-md"
                                    onClick={()=> {removeProfile.mutate({id:pageProp.id})}}
                                >
                                    <FontAwesomeIcon icon={faTrash} color='white' fontSize={15}/>
                                </button>}
                            </div>
                        </div>
                        <p className='text-xl my-5'>{member.name}</p>
                        <div className='my-3 flex flex-col space-y-3'>
                            <div className='grid grid-cols-2 lg:w-[30vw] w-[60vw]'>
                                <p>Role: </p>
                                <p className='bg-sec px-2 py-1 rounded-md text-sm text-white'>{member.role}</p>
                            </div>
                            <div className='grid grid-cols-2 lg:w-[30vw] w-[60vw]'>
                                <p>Phone Number: </p>
                                <p className=' bg-sec px-2 py-1 rounded-md text-sm text-white self-end'>{member.phoneNumber}</p>
                            </div>
                            <div className='grid grid-cols-2 lg:w-[30vw] w-[60vw]'>
                                <p>Email Address: </p>
                                <p className='bg-sec px-2 py-1 rounded-md text-sm text-white'>{member.email}</p>
                            </div>
                            <div className='grid grid-cols-2 lg:w-[30vw] w-[60vw]'>
                                <p>Member Since: </p>
                                <p className=' bg-sec px-2 py-1 rounded-md text-sm text-white self-end'>{member.membership}</p>
                            </div>
                            <div className='grid grid-cols-2 lg:w-[30vw] w-[60vw]'>
                                <p>Permanent Address: </p>
                                <p className='bg-sec px-2 py-1 rounded-md text-sm text-white'>{member.address}</p>
                            </div>
                           
                        </div>
                        

                    </div>}
                </div>
            }
        </div>
    )
}

