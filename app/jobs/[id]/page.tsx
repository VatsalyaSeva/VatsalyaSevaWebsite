"use client"

import React, { useEffect, useState } from 'react'
import UserLayout from '../../userLayout'
import { useRouter } from 'next/navigation';
import { Vacancy } from '@prisma/client';


const fetchJobData = async (id:string,callback:(data)=> void)=>{
    let res = await fetch(`/api/admin/jobs/getSingleJob?id=${id}`,{
        method:"GET"
    })
    let data = await res.json()
    if(data.code == 200){
        callback(data.data)
    }
}

export default function jobs({ params, searchParams }) {
    const route = useRouter()
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [cvFile, setCvFile] = useState<FileList>({})    //   phone      String
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string>('')
    const [data,setData] = useState<Vacancy>({} as Vacancy)

    useEffect(()=>{
        fetchJobData(params.id,setData)
    },[])

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData()
        formData.append('id', params.id)
        formData.append('name', name)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('cvFilePath', cvFile[0])

        fetch('/api/user/saveJobApplication', {
            method: 'POST',
            headers: { 'Access-Control-Allow-Headers': '*' },
            body: formData
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                // console.log(data.message)
                setIsSuccess(true)
                setIsLoading(false)
            }
            else {
                // setIsSuccess(false)
                setIsLoading(false)
                setServerError(data.message)
            }
        })
    }

    return (
        <UserLayout>
            <div className='h-[100vh] w-full flex flex-col space-y-2 items-center pt-10'>
                {!isSuccess ?
                    (serverError.length == 0 ? (!isLoading ?
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
                                    onChange={(e) => setCvFile(e.target.files)}
                                    placeholder='upload CV'
                                    accept='application/pdf' />
                                <button className='px-4 py-1 rounded-md bg-amber-600 w-full text-white mt-2' type='submit'>Apply</button>
                            </form>
                        </div>
                        :
                        <div>
                            <p className='text-xl font-bold color-black'>Submitting...</p>
                        </div>
                    ) :
                        <div className=''>
                            <p className='text-xl font-bold color-black'>{serverError}</p>
                            <p className='my-3 text-blue-600 underline' onClick={() => route.back()}>go back</p>
                        </div>
                    )
                    :
                    <div className=''>
                        <p className='text-xl font-bold color-black'>Your Application is Submitted</p>
                        <p className='my-3 text-blue-600 underline' onClick={() => route.back()}>go back</p>
                    </div>
                }
            </div>
        </UserLayout>
    )
}
