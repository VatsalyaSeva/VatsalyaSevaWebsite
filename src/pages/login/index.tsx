"use client"
import { useRouter } from 'next/navigation'
import React, { FormEvent, use, useEffect, useState } from 'react'


type Data = {
    message: string,
    data: {
        name: string
        phone: string
        email: string
    }
}

export default function Login() {
    const patternEmail = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
    const regex = new RegExp(patternEmail)

    const router = useRouter()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email.length == 0 || regex.test(email)) {
            setError('Invalid Email')
        }
        else if (password.length != 10) {
            setError('password must be 8 characters long')
        }
        else {
            setError('')
            fetch('/api/admin/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then(res => res.json()).then(data => {
                console.log(data)
                if (data.status == 200) {
                    router.push('/admin')
                }
                else {
                    setError(data.message)
                }
            })
        }
    }

    return (
        <div className='w-full h-[100vh] flex flex-col items-center justify-center'>
            <div className='px-8 py-5 bg-amber-100 rounded-xl flex flex-col items-center justify-center'>
                <h2 className='text-2xl font-bold mb-5'>Login</h2>
                <form
                    className='flex flex-col items-center justify-center'
                    onSubmit={handleSubmit} >
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Enter Email'
                        onChange={(e) => setEmail(e.target.value)}
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm' />
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        maxLength={10}
                        onChange={(e) => setPassword(e.target.value)}
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm' />
                    <button
                        type='submit'
                        className={'px-4 py-1 rounded-md bg-red-400 w-full text-white'}>Login</button>
                </form>
                <p className='text-sm pv-2'>{error}</p>
            </div>
        </div>
    )
}
