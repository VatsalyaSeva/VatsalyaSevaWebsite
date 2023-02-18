
import { Vacancy } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import { api } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";


export default function JobList() {
    const [jobList, setJobList] = useState<Vacancy[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const route = useRouter()
    const getVacancyList = api.vacancy.getAll.useQuery()

    useEffect(()=>{
        if(getVacancyList.isLoading){
            setIsLoading(true)
        }
        if(getVacancyList.isSuccess){
            setIsLoading(false)
            setJobList(getVacancyList.data)
        }
    },[getVacancyList.data,getVacancyList.isLoading])
    
    const deleteVacancy = api.vacancy.deleteSingle.useMutation() 

    useEffect(()=>{
        if(deleteVacancy.isLoading){
            setIsLoading(true)
        }
        if(deleteVacancy.isSuccess){
            setIsLoading(false)
            
            getVacancyList.refetch()
        }
    },[deleteVacancy.data,deleteVacancy.isLoading])

    return (isLoading ?
        <div className="grid place-content-end">
            <p className="font-bold text-xl text-black">Loading Data...</p>
        </div> :
        <div className="w-[70vw] h-[100vh] space-y-3">
            <div className="flex justify-between items-center mb-8">
                <button className='flex flex-row items-center space-x-2' onClick={()=> route.replace('/admin')}>
                    <FontAwesomeIcon icon={faArrowLeft} fontSize={24}/>
                    <p className='text-xl font-bold py-2 items-center mr-3'>Dashboard</p>
                </button>
                <button className="text-green-900 "
                    onClick={()=> route.push('/admin/addNewJob')}
                >Create New</button>
            </div>
            {jobList.length > 0 ?
                jobList.map((item, index) => {
                    return (
                        <div className="flex flex-row justify-between items-center" key={index}>
                            <div className="flex flex-row justify-center items-center space-x-3">
                                <p className="font-semibold">{index + 1}.</p>
                                <p className="text-md">{item.vacancyName}</p>

                            </div>
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <button className="bg-green-500 text-white px-3 py-1 rounded-lg" 
                                    onClick={()=> route.push(`/admin/viewSingleJob/${item.id}`)}>View</button>
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                    onClick={()=> route.push(`/admin/editSingleJob/${item.id}`)}
                                >Edit</button>
                                <button
                                    onClick={() => deleteVacancy.mutate({id:item.id})}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg">Delete
                                </button>
                            </div>
                        </div>
                    )
                }) :
                <div className="h-[200px]">
                    <p>No Record Found</p>
                </div>
            }
        </div>
    )
}