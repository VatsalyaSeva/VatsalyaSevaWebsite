// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../prisma'

import { Events, Prisma } from '@prisma/client'

type Data = {
    status: string
    message: string,
    data: Events[]
}

type Error = {
    code: string,
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method == 'GET') {
        let { id } = req.query

        if(typeof(id) == 'string'){
            const singleEvent = await prisma.events.findFirst({
                where:{
                    id:id
                },
                include: {
                    imagesUrl: true,
                    videoUrl: true
                }
            })
            if(singleEvent){
                res.status(200).json({
                    status: '200',
                    message: 'event found success',
                    data: singleEvent
                })

            }
            else{
                res.status(400).json({
                    status: '400',
                    message: 'event not found',
                })
            }
        }
        else{
            res.status(404).json({
                code: '404',
                message: 'Id is Missing'
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
