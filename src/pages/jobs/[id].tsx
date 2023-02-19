"use client"

import React, { FormEvent, useEffect, useState } from 'react'
import UserLayout from '../../components/userLayout'
import { useRouter } from 'next/navigation';
import { Vacancy } from '@prisma/client';
import type { AppProps } from 'next/app'
import { api } from '../../utils/api';
import { sanityClient } from '../../server/storage';
import { basename } from 'path';


Jobs.getInitialProps = async (ctx: { query: { id: string; }; }) => {
    return { id:ctx.query.id }
}

export default function Jobs(pageProp:{id:string}) {
    
    const route = useRouter()
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [cvFile, setCvFile] = useState<File>({} as File)
    const [transactionId, setTransactionId] = useState<string>('')
    const [upiId, setUpiId] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string>('')
    const [data,setData] = useState<Vacancy >({} as Vacancy)

    const getSingleJob = api.vacancy.getById.useQuery({id:pageProp.id,applicant:false})
    const addApplicant = api.applicants.createRecord.useMutation()

    useEffect(() => {
        if(getSingleJob.isSuccess){
            const data = getSingleJob.data
            if(data){
                setData(data)
            }
        }
    }, [getSingleJob.data])

    useEffect(() => {
        if(addApplicant.isError){
            setServerError(addApplicant.error.message)
        }
        if(addApplicant.isSuccess){
            const a = addApplicant.data
            if(a.code == 400){
                setServerError(a.message)
            }else{
                setIsSuccess(true)
            }
        }
    }, [addApplicant.data])

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = await sanityClient.assets.upload(
            'file', cvFile, {
                filename: `${name}_${email}${transactionId}`
            }
        )

        if(data){
            addApplicant.mutate({
                vacancyId:pageProp.id,
                add:{
                    name:name,
                    phone:phone,
                    email:email,
                    transactionId:transactionId,
                    upiId:upiId,
                    cvFilePath:data._id,
                    cvFilePathUrl:data.url
                }
            })
        }
    }

    return (
        <UserLayout>
            <div className='h-min-[100vh] w-full flex flex-col space-y-2 items-center pt-10'>
                {!isSuccess ?
                    (serverError.length == 0 ? (!addApplicant.isLoading ?
                        <div>
                            <h1 className='text-2xl font-bold color-black'>Vacancy Form</h1>
                            <form className='flex flex-col' onSubmit={handleSubmit}>
                                <label className='text-md mt-5 mb-2'>Full Name</label>
                                <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                    type={'text'}
                                    name='name'
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Enter name' />
                                <label className='text-md mt-3 mb-2'>Phone Number</label>
                                <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                    type={'tel'}
                                    name='phone'
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder='Enter phone' />
                                <label className='text-md mt-3 mb-2'>Email Address</label>
                                <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                    type={'email'}
                                    name='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter email' />
                                <label className='text-md mt-3 mb-2'>Upload your CV (.pdf)</label>
                                <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                    type={'file'}
                                    name='cv'
                                    onChange={(e) => {
                                        if (e.target.files != null) {
                                            if (e.target.files[0] != undefined) {
                                              setCvFile(e.target.files[0]);
                                            }
                                          }
                                    }}
                                    placeholder='upload CV'
                                    accept='application/pdf' />

                                {typeof(data.qrCodePathUrl) == 'string' && 
                                    <div className='flex flex-col w-full justify-center'>
                                        <label className='text-md mt-3 mb-2'>Scan QR:-  Form Fees of ₹{data.fees}</label>
                                        <img src={data.qrCodePathUrl} className='h-[350px] w-[300px]' />
                                        <p className='text-sm w-[30vw] my-5'>After the QR Payment, enter your UPI ID and transaction Id in the form.</p>
                                        <label className='text-md mt-3 mb-2'>Enter UPI Id</label>
                                        <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                            type={'text'}
                                            name='text'
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder='Enter UPI Id' />
        
                                        <label className='text-md mt-3 mb-2'>Enter Transaction Id</label>
                                        <input className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
                                            type={'text'}
                                            name='text'
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder='Enter Transaction Id' />
        
                                        <button className='px-4 py-1 rounded-md bg-amber-600 w-full text-white mt-2' type='submit'>Apply</button>
                                    </div>
                                }

                            </form>
                        </div>
                        :
                        <div>
                            <p className='text-xl font-bold color-black'>Submitting...</p>
                        </div>
                    ) :
                        <div className=''>
                            <p className='text-xl font-bold color-black'>{serverError}</p>
                            <p className='my-3 text-blue-600 underline' onClick={() => route.replace('/')}>go back</p>
                        </div>
                    )
                    :
                    <div className=''>
                        <p className='text-xl font-bold color-black'>Your Application is Submitted</p>
                        <p className='my-3 text-blue-600 underline' onClick={() => route.replace('/')}>go back</p>
                    </div>
                }
            </div>
        </UserLayout>
    )
}
