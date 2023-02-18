// import dynamic from "next/dynamic";
// import React,{ useState, FC, FormEvent, useEffect } from "react"

// const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

// let nav = {
//     Events: 'Events',
//     Jobs: 'Jobs',
//     Donations: 'Donations'
// }

// let pages = {
//     createEvent: 'createEvent',
//     eventList: 'eventList',
//     createJob: 'createJob',
//     jobList: 'jobList',
//     applicants: 'applicants',
//     donationList: 'donationList'
// }

// type props = {
//     setPage: (page: string) => void,
//     setNav: (nav: string) => void
// }

// export default function CreateJobs({ setPage, setNav }: props) {


//     const [name, setName] = useState<string>('')
//     const [description, setDescription] = useState<string>('')
//     const [jobCount, setJobCount] = useState<string>('0')
//     const [salary, setSalary] = useState<string>('0')
//     const [lastSubmissionDate, setLastSubmissionDate] = useState<string>('')
//     const [interviewDate, setInterviewDate] = useState<string>('')
//     const [location, setLocation] = useState<string>('')
//     const [applicationFee, setApplicationFee] = useState<string>('0')
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [isSuccess, setIsSuccess] = useState<boolean>(false)
//     const [loadingMsg, setLoadingMsg] = useState<string>('')
//     const [error, setError] = useState<string>('')

//     const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         if (name.length == 0 || description.length == 0 || location.length == 0) {
//             setError('Field Empty')
//         }
//         else {
//             setIsLoading(true)
//             setLoadingMsg('Wait, Adding New Record..')
//             fetch('/api/admin/vaccancy/saveNewJob', {
//                 method: 'POST',
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     name: name,
//                     description: description,
//                     jobCount: jobCount,
//                     salary: salary,
//                     interviewDate: interviewDate,
//                     lastSubmissionDate: lastSubmissionDate,
//                     location: location,
//                     applicationFee: applicationFee
//                 })
//             }).then(res => res.json()).then(data => {
//                 if (data.status == 200) {
//                     // setIsLoading(false)
//                     setLoadingMsg('Record Added successfully...')
//                     setIsSuccess(true)
//                 }
//                 else {
//                     setError(data.message)
//                 }
//             })
//         }

//     }

//     return (isLoading ?
//         <div className="grid place-content-end">
//             <p className="font-bold text-2xl text-black">{loadingMsg}</p>
//             {isSuccess &&
//                 <div className="space-x-3 flex flex-row item-center">
//                     <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer" onClick={() => setPage(pages.jobList)}>Job List</p>
//                     <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer"
//                         onClick={() => {
//                             setIsLoading(false)
//                             setIsSuccess(false)
//                         }}>add new record</p>
//                 </div>}
//         </div> :
//         <div className=' w-[43vw] py-8 '>
//             <form
//                 className='flex flex-col'
//                 onSubmit={handleSubmit}>
//                 <p className='text-xl font-bold text-black my-5 self-center'>New Job</p>
//                 <p className="font-medium text-md py-1">Job Name</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
//                     name="name"
//                     type='text'
//                     placeholder='Job name'
//                     required
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Job description</p>
                
//                 <RichTextEditor onChange={setDescription} value={''}/>
                
//                 <p className="font-medium text-md py-1">Job location</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
//                     name="address"
//                     type='text'
//                     required
//                     placeholder='Job location'
//                     onChange={(e) => setLocation(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Post Count</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
//                     name="name"
//                     type='number'
//                     required
//                     placeholder='Post Count'
//                     onChange={(e) => setJobCount(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Job Salary</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
//                     name="name"
//                     type='number'
//                     required
//                     placeholder='Job Salary'
//                     onChange={(e) => setSalary(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Form Fees</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
//                     name="number"
//                     type='text'
//                     required
//                     placeholder='Form Fees'
//                     onChange={(e) => setApplicationFee(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Last Apply Date</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
//                     name="date"
//                     type='date'
//                     required
//                     placeholder='Last Apply Date'
//                     onChange={(e) => setLastSubmissionDate(e.target.value)}
//                 />
//                 <p className="font-medium text-md py-1">Interview Date</p>
//                 <input
//                     className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600 '
//                     name="date"
//                     type='date'
//                     required
//                     placeholder='Interview Date'
//                     onChange={(e) => setInterviewDate(e.target.value)}
//                 />
                

//                 <button
//                     type='submit'
//                     className='px-4 py-1 rounded-md bg-amber-600 w-full text-white'>Create</button>
//             </form>
//             <p>{error}</p>
//         </div>
//     )
// }