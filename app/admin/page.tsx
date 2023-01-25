"use client"

import React, { use, useEffect, useState } from 'react'
import Applicants from './applicants'
import CreateEvent from './createEvents'
import CreateJobs from './createJobs'
import DonationList from './donationList'
import EventList from './eventList'
import JobList from './jobList'
import CreateMember from './createMember'

export default function admin() {
    let nav = {
        Events: 'Events',
        Jobs: 'Jobs',
        Donations: 'Donations',
        Members:'Members'
    }

    let pages = {
        createEvent: 'createEvent',
        eventList: 'eventList',
        createJob: 'createJob',
        jobList: 'jobList',
        applicants: 'applicants',
        donationList: 'donationList',
        membersList:'membersList',
        createMember:'createMember'
    }

    const [currentNav, setCurrentNav] = useState<string>('Events')
    const [currentPage, setCurrentPage] = useState<string>('')

    return (
        <div className="container flex flex-row">
            <div className="w-[15vw] min-w-[200px] h-[100%] rounded-br-xl shadow-xl bg-amber-700 py-5 px-5 ">
                <p className='text-2xl font-bold text-white'>Admin Panel</p>
                <div className='pt-10'>
                <p
                    onClick={() => setCurrentNav(nav.Members)}
                    className={`py-2 text-lg  text-white hover:text-xl  cursor-pointer ${currentNav == nav.Members && 'font-bold text-xl'}`}>Members</p>
                {currentNav == nav.Members &&
                    <div>
                        <p
                            onClick={() => setCurrentPage(pages.createMember)}
                            className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.createEvent && 'border-b border-amber-200'}`}>Create member</p>
                        <p
                            onClick={() => setCurrentPage(pages.membersList)}
                            className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.eventList && 'border-b border-amber-200'}`}>Members List </p>
                    </div>}
                    <p
                        onClick={() => setCurrentNav(nav.Events)}
                        className={`py-2 text-lg  text-white hover:text-xl  cursor-pointer ${currentNav == nav.Events && 'font-bold text-xl'}`}>Events</p>
                    {currentNav == nav.Events &&
                        <div>
                            <p
                                onClick={() => setCurrentPage(pages.createEvent)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.createEvent && 'border-b border-amber-200'}`}>Create events</p>
                            <p
                                onClick={() => setCurrentPage(pages.eventList)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.eventList && 'border-b border-amber-200'}`}>Events List </p>
                        </div>}
                    <p
                        onClick={() => setCurrentNav(nav.Jobs)}
                        className={`py-2 text-lg  text-white hover:text-xl  cursor-pointer ${currentNav == nav.Jobs && 'font-bold text-xl'}`}>Jobs</p>
                    {currentNav == nav.Jobs &&
                        <div>
                            <p
                                onClick={() => setCurrentPage(pages.createJob)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.createJob && 'border-b border-amber-200'}`}>Create new</p>
                            <p
                                onClick={() => setCurrentPage(pages.jobList)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.jobList && 'border-b border-amber-200'}`}>Job List </p>
                            {/* <p
                                onClick={() => setCurrentPage(pages.applicants)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.applicants && 'border-b border-amber-200'}`}>Applicants</p> */}
                        </div>}
                    <p
                        onClick={() => setCurrentNav(nav.Donations)}
                        className={`py-2 text-lg  text-white hover:text-xl  cursor-pointer ${currentNav == nav.Donations && 'font-bold text-xl'}`}>Donations</p>
                    {currentNav == nav.Donations &&
                        <div>
                            <p
                                onClick={() => setCurrentPage(pages.donationList)}
                                className={`py-2 text-sm ml-4 text-white cursor-pointer ${currentPage == pages.donationList && 'border-b border-amber-200'}`}>Donation List </p>
                        </div>}
                </div>
            </div>
            <div className='px-5 py-5 w-[85vw]  flex flex-col items-center justify-center'>
                {currentPage == pages.createMember &&
                    <CreateMember setPage={setCurrentPage} setNav={setCurrentNav} />}
                {currentPage == pages.createEvent &&
                    <CreateEvent setPage={setCurrentPage} setNav={setCurrentNav} />}
                {currentPage == pages.createJob &&
                    <CreateJobs setPage={setCurrentPage} setNav={setCurrentNav} />}
                {currentPage == pages.donationList &&
                    <DonationList setPage={setCurrentPage} setNav={setCurrentNav} />}
                {currentPage == pages.eventList &&
                    <EventList setPage={setCurrentPage} setNav={setCurrentNav} />}
                {currentPage == pages.jobList &&
                    <JobList setPage={setCurrentPage} setNav={setCurrentNav} />}
            </div>
        </div>
    )
}