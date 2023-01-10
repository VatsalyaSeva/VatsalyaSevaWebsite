// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma'

import nextConnect from 'next-connect';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.get(async (req, res) => {
    const { query } = req
    if(typeof(query.id) == 'string'){
        let allApplicant = await prisma.applecants.findMany({
            where:{
                vacancyId:parseInt(query.id)
            }
        })
        if(allApplicant){
            res.status(200).json({
                code:200,
                message:'success',
                data:allApplicant
            })
        }
        else{
            res.status(400).json({
                code:400,
                message:'vacancy not found',

            })
        }
    }
    else{
        res.status(400).json({
            code:400,
            status:'id is missing'
        })
    }
})

export default apiRoute
