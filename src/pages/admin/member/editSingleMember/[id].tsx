
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Member, Vacancy } from '@prisma/client'
import { AppProps } from 'next/app'
import { api } from '../../../../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), { ssr: false });

EditMember.getInitialProps = async (ctx: { query: { id: string } }) => {
    return { id:ctx.query.id }
}

export default function EditMember(pageProp:AppProps['pageProps']){
    const router = useRouter()
    const getSingleMember = api.member.getById.useQuery({id:pageProp.id})
    const updateSingleMember = api.member.updateMember.useMutation()

    const [memberName, setMemberName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const [memberImage, setMemberImage] = useState<File>({} as File)
    const [address,setAddress] = useState<string>('')
    const [membership,setMembership] = useState<string>('')

    useEffect(()=>{
        if(getSingleMember.isSuccess){
            const data = getSingleMember.data
            if(data != null){
                setMemberName(data.name)
                setPhoneNumber(data.phoneNumber)
                setEmail(data.email)
                setRole(data.role)
                setAddress(data.address)
                setMembership(data.membership)
            }
        }
    },[getSingleMember.data])

    useEffect(()=>{
        if(updateSingleMember.isSuccess){
            router.back()
        }
    },[updateSingleMember.data])

    const handleSubmit = () => {
        updateSingleMember.mutate({
            id:pageProp.id,
            name:memberName,
            email:email,
            address:address,
            role:role,
            phoneNumber:phoneNumber,
            membership:membership
        })
    }

    return(
        <div className="py-8 container w-[100vw] h-min-[100vh] flex justify-center items-center">
            <div className=' w-[90vw] md:w-[70vw] flex flex-col justify-center items-center'>
                <div className='flex justify-between items-center w-full mb-5'>
                    <button className='flex flex-row items-center space-x-2' onClick={()=> router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                        <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Back</p>
                    </button>
                    <button className="text-sm md:text-md bg-green-700  text-white px-3 py-1 rounded-lg"
                        onClick={()=> handleSubmit()}
                    >Submit</button>
                </div>
                <form
                    className='flex flex-col w-full'
                    >
                    <p className="font-medium text-sm md:text-md py-1">Member Name</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='text'
                        defaultValue={memberName}
                        placeholder='Member name'
                        required
                        onChange={(e) => setMemberName(e.target.value)}
                    />
                    <p className="font-medium text-sm md:text-md py-1">Member Phone Number</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='phone'
                        required
                        defaultValue={phoneNumber}
                        placeholder='Phone number'
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p className="font-medium text-sm md:text-md py-1">Member Email</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='email'
                        required
                        defaultValue={email}
                        placeholder='Enter email '
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <p className="font-medium text-sm md:text-md py-1">Member Address</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='address'
                        required
                        defaultValue={address}
                        placeholder='enter address'
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <p className="font-medium text-sm md:text-md py-1">Membership date</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='date'
                        required
                        defaultValue={membership}
                        placeholder='select Date'
                        onChange={(e) => {
                            setMembership(e.target.value)
                        }}
                    />
                    <p className="font-medium text-sm md:text-md py-1">Member Role</p>
                    <input
                        className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                        type='text'
                        required
                        defaultValue={role}
                        placeholder='Enter role'
                        onChange={(e) => setRole(e.target.value)}
                    />
                    
                    
                </form>
            </div>
        </div>
    )
}

