
import { Vacancy } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import { api } from "../../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "lottie-react";
import { sessionOptions } from "../../../server/api/trpc";
import { withIronSessionSsr } from "iron-session/next";


export default function JobList() {
    const [jobList, setJobList] = useState<Vacancy[]>([])
    const route = useRouter()
    const getVacancyList = api.vacancy.getAll.useQuery()
    const deleteVacancy = api.vacancy.deleteSingle.useMutation() 
    const [deleteIndex,setDeleteIndex] = useState<number>(-1)

    useEffect(()=>{
        if(getVacancyList.isSuccess){
            setJobList(getVacancyList.data)
        }
    },[getVacancyList.data,getVacancyList.isLoading])
    

    useEffect(()=>{
        if(deleteVacancy.isSuccess){
            setDeleteIndex(-1)
            const data = deleteVacancy.data
            if(data){
                setJobList(jobList.filter(item => item.id != data.id))
            }
        }
    },[deleteVacancy.data])

    return (getVacancyList.isLoading ?
        <div className="grid place-content-center h-[400px] w-[100vw]">
            <Lottie 
                animationData={require('../../../../public/lottie/loading.json')}
                className='h-[50px] w-[50px]'
            />
        </div> :
        <div className="w-[100vw] h-min-[100vh] md:px-8 px-4 py-5">
            <div className="flex justify-between items-center mb-8">
                <button className='flex flex-row items-center space-x-2' onClick={()=> route.replace('/admin/dashboard')}>
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={20}/>
                    <p className='md:text-xl text-lg font-bold py-2 items-center mr-3'>Dashboard</p>
                </button>
                <button className="text-green-900 text-sm md:text-md"
                    onClick={()=> route.push('/admin/job/addNewJob')}
                >Create New</button>
            </div>
            <div className="space-y-4">
                {jobList.length > 0 ?
                    jobList.map((item, index) => {
                        return (deleteIndex != index ?
                            <div className="grid md:grid-cols-2 grid-rows-2 gap-1 md:gap-0 " key={index}>
                                <div className="flex flex-row justify-start items-start space-x-3">
                                    <p className="font-semibold">{index + 1}.</p>
                                    <p className="text-md">{item.vacancyName}</p>

                                </div>
                                <div className="flex flex-row justify-end items-center space-x-2 ">
                                    <button className="text-sm md:text-md bg-green-500 text-white px-3 py-1 rounded-lg" 
                                        onClick={()=> route.push(`/admin/job/viewSingleJob/${item.id}`)}>View</button>
                                    <button className="text-sm md:text-md bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                        onClick={()=> route.push(`/admin/job/editSingleJob/${item.id}`)}
                                    >Edit</button>
                                    <button
                                        onClick={() => {
                                            setDeleteIndex(index)
                                            deleteVacancy.mutate({id:item.id})
                                        }}
                                        className="bg-red-500 text-sm md:text-md text-white px-3 py-1 rounded-lg">Delete
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="w-[full] h-[40px] my-4 grid place-content-center">
                                <Lottie 
                                    animationData={require('../../../../public/lottie/loading.json')}
                                    className='h-[50px] w-[50px]'
                                />
                            </div>
                        )
                    }) :
                    <div className="h-[200px]">
                        <p>No Record Found</p>
                    </div>
                }
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