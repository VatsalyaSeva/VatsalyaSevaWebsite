// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../../prisma'

import { Vacancy, Prisma } from '@prisma/client'

type Data = {
    status: string
    message: string,
}

type Error = {
    code: string,
    message: string
}

type req = {
    name: string
    description: string
    jobCount: string
    salary: string
    lastSubmissionDate: string,
    interviewDate: string,
    location: string
    applicationFee: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method == 'POST') {

        const {
            name,
            description,
            jobCount,
            salary,
            lastSubmissionDate,
            interviewDate,
            location,
            applicationFee }: req = req.body
        
        const { id } = req.query 
        if(typeof(id) == 'string'){

            const updatedVacancy = await prisma.vacancy.update({
                where:{
                    id:parseInt(id)
                },
                data: {
                    vacancyName: name,
                    vacancyDescription: description,
                    jobCount: parseInt(jobCount),
                    salary: parseInt(salary),
                    lastSubmissionDate: new Date(lastSubmissionDate).toISOString(),
                    interviewDate: new Date(interviewDate).toISOString(),
                    location: location,
                    fees: parseInt(applicationFee)
                }
            })
            if(updatedVacancy){
                res.status(200).json({
                    code: '200',
                    message: 'Vacancy updated success',
                })
            }
            else{
                res.status(400).json({
                    code: '400',
                    message: 'Vacancy not found',
                })
            }
        }
        else{
            res.status(404).json({
                code:'404',
                message:'Id is missing in url'
            })
        }

    }
    else {
        res.status(500).json({
            code: '500',
            message: 'Method not allowed'
        })
    }
}
