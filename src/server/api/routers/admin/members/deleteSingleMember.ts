// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import prisma from '../../../../prisma'

import nextConnect from 'next-connect';
import multer from 'multer';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.post(async (req, res) => {
    const { id } = req.query

    if (typeof (id) == 'string') {
        const member = await prisma.member.delete({
            where: {
                id: id
            }
        })
        if (member) {
            res.status(200).json({
                code: 200,
                data: member
            })
        }
        else {
            res.status(404).json({
                code: 404,
                message: 'member not found'
            })
        }
    }
    else {
        res.status(404).json({
            code: 404,
            message: 'Id required'
        })
    }
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};