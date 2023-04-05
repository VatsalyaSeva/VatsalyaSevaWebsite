// import Razorpay from 'razorpay'
// import Razorpay from 'razorpay';
import React from 'react'
import { api } from '../utils/api'

export default function Footer() {

    // let createOrder = api.donation.createRazerPayOrder.useMutation({
    //     onSuccess:(res)=>{

    //         if(window !== undefined){
    //             var options = {
    //                 "key": "rzp_test_8UPUyLkgsd2CFB", // Enter the Key ID generated from the Dashboard
    //                 "amount": res.amount,
    //                 "currency": res.currency,
    //                 "handler": function (response: any) {
    //                   alert(response);
    //                 },
                    
    //               };
    //               let pay = new Razorpay(options);
                  
    //              pay.open()
    //         }
    //     },
    //     onError:(res)=>{

    //     }
    // })

    return (
        <div className='bg-amber-100 w-full  px-2 space-y-5 rounded-tl-[50px] mt-[50px] rounded-tr-[50px]'>
            <div className='py-7 border-b-[2px] border-red-800 w-full flex sm:flex-row flex-col justify-center items-center space-x-3 space-y-3'>
                <p className='font-semibold text-lg pt-2'>Donate to Vatsalya Seva Santhan</p>
                <button className='flex flex-row justify-center items-center'
                    // onClick={()=> createOrder.mutate({amount:'200',currency:'INR'})}
                >
                    <p className='border-2 rounded-tl-lg rounded-bl-lg border-red-500 px-5 py-2'>5000₹</p>
                    <p className='bg-red-500 px-3 py-2 text-white rounded-tr-lg rounded-br-lg'>Donate</p>
                </button>
            </div>
            <div className='w-full flex md:flex-row flex-col items-center justify-evenly px-10 pb-5 space-y-5'>
                <div className='lg:w-1/3 flex flex-col items-center'>
                    <p className=' text-lg font-semibold text-red-800'>Contact Address</p>
                    <p className='text-center max-w-[300px]'>Vatsalya Seva Sansthan, Sector 6, Savina Udaipur (Rajasthan)- 313001</p>
                </div>
                <div className=' lg:w-1/3 flex flex-col items-center'>
                    <p className='text-lg font-semibold text-red-800'>Contact Details</p>
                    <p>Contact no.  +91 7727872633</p>
                    <p>Whatsapp no. +91 7727872633</p>
                    <p>Mail address. vatslyasevasesthan@gmail.com</p>
                </div>
                
            </div>
        </div>
    )
}
