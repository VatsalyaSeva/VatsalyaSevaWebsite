// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import prisma from '../../../prisma'

import nextConnect from 'next-connect';
import multer from 'multer';

import { Prisma, Applecants } from '@prisma/client'
import path from 'path'


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => { cb(null, './public/pdfs/jobs') },
        filename: (req, file, cb) => cb(null, `${req.body.name.slice(0, 5)}_${file.originalname}`),
    }),
});

const apiRoute = nextConnect<NextApiRequest & {files:Express.Multer.File[]}, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('cvFilePath');
apiRoute.use(uploadMiddleware);
apiRoute.post(async (req, res) => {
    const { id, name, phone, email } = req.body

    type file = {
        destination: string,
        filename: string,
        mimetype: string
    }

    const existingUser = await prisma.applecants.findFirst({
        where: { email: email, phone: phone, vacancyId: parseInt(id) },
    });

    console.log('existingUser', existingUser)

    if (existingUser) {
        res.status(400).json({
            status: '400',
            message: 'Application Already submitted',
            // data:newApplicant
        })
    }
    else {
        let cvFilePath = `pdfs/jobs/${req.files[0].filename}`

        const newApplicant = await prisma.applecants.create({
            data: {
                name: name,
                phone: phone,
                email: email,
                cvFilePath: cvFilePath,
                createdAt: new Date(),
                vacancy: {
                    connect: {
                        id: parseInt(id)
                    }
                }
            }
        })

        res.status(200).json({
            status: '200',
            message: 'Application created success',
            data: newApplicant
        })
    }

})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};