// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../prisma'

import { Donation, Prisma } from '@prisma/client'

type Data = {
    status: string
    message: string,
    data: Donation[]
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

        const donation = await prisma.donation.findMany({})
        res.status(200).json({
            status: '200',
            message: 'All donations data',
            data: donation
        })

    }
    else {
        res.status(500).json({
            code: '500',
            message: 'Method not allowed'
        })
    }
}
