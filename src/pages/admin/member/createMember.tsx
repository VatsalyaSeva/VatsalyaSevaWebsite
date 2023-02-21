import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, FC, FormEvent, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { sanityClient } from "../../../server/storage"
import { basename } from "path"
import fs from "fs-extra"
import { fileURLToPath } from "url"
import { api } from "../../../utils/api"
import { sessionOptions } from "../../../server/api/trpc"
import { withIronSessionSsr } from "iron-session/next"


export default function CreateMember({}) {

    const addMember = api.member.createMember.useMutation()

    const [memberName, setMemberName] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [role, setRole] = useState<string>('')
    const router = useRouter()
    const [memberImage, setMemberImage] = useState<File>({} as File)
    const [address,setAddress] = useState<string>('')
    const [membership,setMembership] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [loadingMsg, setLoadingMsg] = useState<string>('')
    const [error, setError] = useState<string>('')

    // sanityClient.delete('image-dbd04fa33cfd495d73e6c8071ce8f9afe05bb515-3840x2160-jpg').then(data=> console.log(data))

    const handleSubmit = async () => {
        const filePath = URL.createObjectURL(memberImage)
        const data = await sanityClient.assets.upload(
            'image', memberImage, {
                filename: basename(filePath)
            }
        )
        if(data){
            addMember.mutate({
                name:memberName,
                email:email,
                address:address,
                role:role,
                phoneNumber:phoneNumber,
                membership:membership,
                profilePic:data._id,
                profilePicUrl:data.url
            })
        }
    }

    useEffect(()=>{
        if(addMember.isSuccess){
            router.back()
        }
    },[addMember.data])

    return (
        <div className="py-8 container w-[100vw] h-min-[100vh] flex justify-center items-center">
            {addMember.isLoading ?
                <div className="w-[70vw] flex justify-center items-center">
                    <p className="font-bold text-2xl text-black">Adding Member please Wait..</p>
                    {isSuccess &&
                        <div className="space-x-3 flex flex-row item-center">
                            <p className="text-blue-500 font-medium text-lg py-2 underline cursor-pointer"
                                onClick={() => {
                                    setIsLoading(false)
                                    setIsSuccess(false)
                                }}>add new record</p>
                        </div>}
                </div> :
                <div className=' w-[90vw] md:w-[70vw] flex flex-col justify-center items-center'>
                    <div className='flex justify-between items-center w-full mb-5'>
                            <button className='flex flex-row items-center space-x-2' onClick={()=> router.back()}>
                                <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                                <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Create New</p>
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
                            placeholder='Member name'
                            required
                            onChange={(e) => setMemberName(e.target.value)}
                        />
                        <p className="font-medium text-sm md:text-md py-1">Member Phone Number</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            type='phone'
                            required
                            placeholder='Phone number'
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <p className="font-medium text-sm md:text-md py-1">Member Email</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            type='email'
                            required
                            placeholder='Enter email '
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <p className="font-medium text-sm md:text-md py-1">Member Address</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            type='address'
                            required
                            placeholder='enter address'
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <p className="font-medium text-sm md:text-md py-1">Membership date</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            type='date'
                            required
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
                            placeholder='Enter role'
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <p className="font-medium text-sm md:text-md py-1">Member Image</p>
                        <input
                            className='mb-3 bg-white rounded-md px-3 py-2 placeholder:text-gray-600 text-sm border border-amber-600'
                            type='file'
                            required
                            accept="image/*"
                            placeholder='Member image'
                            onChange={(e) => {
                                if (e.target.files != null) {
                                    if (e.target.files[0] != undefined) {
                                        setMemberImage(e.target.files[0]);
                                    }
                                }
                            }}
                        />
                        
                    </form>
                    <p>{error}</p>
                </div>
            }
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