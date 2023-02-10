import { useState, FC, FormEvent } from "react"

let nav = {
    Events: 'Events',
    Jobs: 'Jobs',
    Donations: 'Donations',
    Members: 'Members'
}

let pages = {
    createEvent: 'createEvent',
    eventList: 'eventList',
    createJob: 'createJob',
    jobList: 'jobList',
    applicants: 'applicants',
    donationList: 'donationList',
    membersList: 'membersList',
    createMember: 'createMember'
}

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function CreateMember({ setPage, setNav }: props) {
    const [memberName, setMemberName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const [memberImage, setMemberImage] = useState<Blob>({} as Blob)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [loadingMsg, setLoadingMsg] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let formData = new FormData();

        if (memberName.length == 0 || phoneNumber.length == 0 || email.length == 0) {
            setError('Field Empty')
        }
        else {
            formData.append('memberName', memberName)
            formData.append('phoneNumber', phoneNumber)
            formData.append('email', email)
            formData.append('role', role)
            formData.append("memberImage", memberImage)
            setIsLoading(true)
            setLoadingMsg('Wait, Adding New Record..')
            fetch('/api/admin/members/saveSingleMember', {
                method: 'POST',
                // headers: { "Content-Type": "multipart/formData" },
                body: formData
            }).then(res => res.json()).then(data => {
                if (data.code == 200) {
                    // setIsLoading(false)
                    setLoadingMsg('Record Added successfully...')
                    setIsSuccess(true)
                }
                else {
                    setError(data.message)
                }
            })
        }

    }

    return (isLoading ?
        <div className="grid place-content-end">
            <p className="font-bold text-2xl text-black">{loadingMsg}</p>
            {isSuccess &&
                <div className="space-x-3 flex flex-row item-center">
                    <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer" onClick={() => setPage(pages.jobList)}>Job List</p>
                    <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer"
                        onClick={() => {
                            setIsLoading(false)
                            setIsSuccess(false)
                        }}>add new record</p>
                </div>}
        </div> :
        <div className=' w-[43vw] py-8 '>
            <form
                className='flex flex-col'
                onSubmit={handleSubmit}>
                <p className='text-xl font-bold text-black my-5 self-center'>New Member</p>
                <p className="font-medium text-md py-1">Member Name</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'

                    type='text'
                    placeholder='Member name'
                    required
                    onChange={(e) => setMemberName(e.target.value)}
                />
                <p className="font-medium text-md py-1">Member Phone Number</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'

                    type='phone'
                    required
                    placeholder='Phone Number'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="font-medium text-md py-1">Member Email</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'

                    type='email'
                    required
                    placeholder='Email address'
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className="font-medium text-md py-1">Member Role</p>
                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'

                    type='text'
                    required
                    placeholder='Enter role'
                    onChange={(e) => setRole(e.target.value)}
                />
                <p className="font-medium text-md py-1">Member Image</p>

                <input
                    className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'

                    type='file'
                    required
                    placeholder='Member image'
                    onChange={(e) => setMemberImage(e.target.files)}
                />


                <button
                    type='submit'
                    className='px-4 py-1 rounded-md bg-amber-600 w-full text-white'>Create</button>
            </form>
            <p>{error}</p>
        </div>
    )
}