"use client"
import { Vacancy } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function JobList({ setPage, setNav }: props) {
    const [jobList, setJobList] = useState<Vacancy[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedJob, setSelectedJob] = useState<Vacancy>({} as Vacancy)
    const route = useRouter()
    const deleteVacancy = (id: string) => {
        setIsLoading(true)
        fetch('api/admin/deleteSingleVaccancy', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false)
            if (data.status == 200) {
                getAllVacancy()
            }
        })
    }

    const getAllVacancy = () => {
        setIsLoading(true)
        fetch('api/admin/getAllJobs', {
            method: 'GET'
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setJobList(data.data)
                setIsLoading(false)
            }
        })
    }

    useEffect(() => {
        getAllVacancy()
    }, [])


    return (isLoading ?
        <div className="grid place-content-end">
            <p className="font-bold text-xl text-black">Loading Data...</p>
        </div> :
        <div className="w-[70vw] h-[100vh] space-y-3">
            {jobList.length > 0 ?
                jobList.map((item, index) => {
                    return (
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row justify-center items-center space-x-3">
                                <p className="font-bold">{index + 1}.</p>
                                <p className="text-lg">{item.vacancyName}</p>

                            </div>
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <button className="bg-green-500 text-white px-3 py-1 rounded-lg" 
                                    onClick={()=> route.push(`/admin/viewSingleJob?id=${item.id}`)}>View</button>
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
                                    onClick={()=> route.push(`/admin/editSingleJob?id=${item.id}`)}
                                >Edit</button>
                                <button
                                    onClick={() => deleteVacancy(item.id.toString())}
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