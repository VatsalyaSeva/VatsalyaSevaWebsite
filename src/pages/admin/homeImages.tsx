import { faArrowLeft, faBackward, faCalendar, faCoins, faFile, faImage, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'  
import { api } from '../../utils/api'
import { HomeImages } from '@prisma/client'
import { FilePickerReturnTypes, useFilePicker } from 'use-file-picker'
import { sanityClient } from '../../server/storage'
import { basename } from 'path'
import Lottie from "lottie-react";
import { sessionOptions } from '../../server/api/trpc'
import { withIronSessionSsr } from 'iron-session/next'

export default function Carousal() {
    const router = useRouter()
    let [homeImages,setHomeImages] = useState<HomeImages[]>([])
    let getAllHomeImages = api.homeImage.getAllRecord.useQuery()
    let addHomeImage = api.homeImage.addRecord.useMutation()
    let deleteImage = api.homeImage.deleteSingleRecord.useMutation()
    let [openFileSelector, { filesContent, loading,errors,clear }]:FilePickerReturnTypes = useFilePicker({
        accept:'image/*',
        multiple:false,
        readAs:'ArrayBuffer',
        maxFileSize:5,
    })
    let [deleteImageIndex,setDeleteImageIndex] = useState<number>(-1)
    

    useEffect(()=>{
        if(filesContent.length>0 && !errors[0]?.fileSizeToolarge){
            let file = filesContent[0]
            if(file){
                let n = Buffer.from(file.content)
                sanityClient.assets.upload('image',n,{
                    filename: basename(file.name)
                }).then(data =>{
                    addHomeImage.mutate({
                        imageSource:data._id,
                        imageSourceUrl:data.url,
                        imageDescription:''
                    })
                })
    
            }
        }
    },[filesContent,errors])

    useEffect(()=>{
        if(getAllHomeImages.isSuccess){
            setHomeImages(getAllHomeImages.data)
        }
    },[getAllHomeImages.data])

    useEffect(()=>{
        if(addHomeImage.isSuccess){
            clear()
            let newImage = addHomeImage.data
            setHomeImages([...homeImages,newImage])
        }
    },[addHomeImage.data])

    useEffect(()=>{
        if(deleteImage.isSuccess){
            let res = deleteImage.data
            setHomeImages(homeImages.filter((item)=> item.id != res.id))
            setDeleteImageIndex(-1)
        }
    },[deleteImage.data])

    return (
        <div className="container px-5 h-min-[100vh] w-[100vw] place-content-center flex justify-center my-10">
            <div className='w-[80vw]'>
                <div className='w-min-[50vw] flex justify-between items-center'>
                    <div className='flex space-x-2 items-center' onClick={()=> router.replace('/admin')}>
                        <FontAwesomeIcon icon={faArrowLeft} fontSize={24} color='black'/>
                        <p className='text-xl my-2 font-medium'>Dashboard</p>
                    </div>
                    { 
                        !addHomeImage.isLoading ?
                            <button
                                className="rounded-lg  bg-green-700 px-3 py-1 text-sm text-white"
                                onClick={() => {
                                    openFileSelector()
                                }}
                            >Add</button>:
                            <Lottie 
                                animationData={require('../../../public/lottie/loading.json')}
                                className='h-[50px] w-[50px]'
                            />
                        
                    }
                </div>
                <div className={`w-full ${homeImages.length == 0 && 'bg-tri'} rounded-xl py-3`}>
                    {getAllHomeImages.isLoading ? 
                        <div className='w-full text-center'>loading...</div> : 
                            (homeImages.length > 0 ?
                                <div className='grid grid-cols-4 gap-x-4 gap-y-5'>
                                {homeImages.map((image,index)=>{
                                        return(index != deleteImageIndex ?
                                            <div key={index} className='relative'>
                                                 <img 
                                                    src={image.imageSourceUrl} 
                                                    alt="" className='w-full h-[130px] rounded-lg' />
                                                <div className='absolute z-[3px] top-[10px] right-[10px]'
                                                    onClick={()=> {
                                                        setDeleteImageIndex(index)
                                                        deleteImage.mutate({id:image.id})
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} fontSize={20} color={'white'}/>
                                                </div>
                                            </div>:
                                            <div className='w-full h-full flex justify-center items-center'>
                                                <Lottie 
                                                    animationData={require('../../../public/lottie/delete.json')}
                                                    className='h-[130px] w-[130px]'
                                                />
                                            </div>
                                        )
                                })}
                                </div>
                                :
                                <div className='w-full h-[50px] flex justify-center items-center flex-col  space-y-1'>
                                    <p>No Record found</p>
                                    
                                </div>
                            )
                        }
                </div>
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