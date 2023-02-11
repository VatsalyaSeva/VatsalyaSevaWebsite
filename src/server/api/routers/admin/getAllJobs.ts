// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../prisma'

import { Vacancy, Prisma } from '@prisma/client'

type Data = {
    status: string
    message: string,
    data: Vacancy[]
}

type Error = {
    code: string,
    message: string
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method == 'GET') {

        const vacancy = await prisma.vacancy.findMany({})
        res.status(200).json({
            status: '200',
            message: 'Al Jobs data',
            data: vacancy
        })

    }
    else {
        res.status(500).json({
            code: '500',
            message: 'Method not allowed'
        })
    }
}
