import { Vacancy } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"
import { useTable } from 'react-table';

type props = {
    setPage: (page: string) => void,
    setNav: (nav: string) => void
}

export default function JobList({ setPage, setNav }: props) {
    const [jobList, setJobList] = useState<Vacancy[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedJob, setSelectedJob] = useState<Vacancy>({} as Vacancy)
    const deleteVacancy = (id: string) => {
        fetch('api/admin/deleteSingleVaccancy', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(res => res.json()).then(data => {
            if (data.status == 200) {
                setJobList(data.data)
                setIsLoading(false)
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
        <div className="w-[70vw] h-[100vh]">
            {jobList.length > 0 ?
                jobList.map((item, index) => {
                    return (
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row justify-center items-center space-x-3">
                                <p className="font-bold">{index + 1}.</p>
                                <p className="text-lg">{item.vacancyName}</p>

                            </div>
                            <div className="flex flex-row justify-center items-center space-x-2">
                                <button className="bg-green-500 text-white px-3 py-1 rounded-xl">View</button>
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-xl">Edit</button>
                                <button
                                    onClick={() => deleteVacancy(item.id.toString())}
                                    className="bg-red-500 text-white px-3 py-1 rounded-xl">Delete
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