// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import prisma from '../../../prisma'

import nextConnect from 'next-connect';
import multer from 'multer';

import { Events, Prisma } from '@prisma/client'
import path from 'path'

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if ((file.mimetype.startsWith('video/'))) {
                cb(null, './public/videos/events');
            }
            else if (file.mimetype.startsWith('image/')) {
                cb(null, './public/images/events');
            }
        },
        filename: (req, file, cb) => cb(null, `${req.body.eventName.slice(0, 5)}_${file.originalname}`),
    }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('eventImages');
apiRoute.use(uploadMiddleware);
// apiRoute.use((req,res,next)=>{
//     req.header('Access-Control-Allow-Origin', '*');
//     re.header('Access-Control-Allow-Headers', '*');
// })

apiRoute.post(async (req, res) => {
    const { eventName, eventDate, eventLocation } = req.body

    // console.log(req.files[`${}`])

    type file = {
        destination: string,
        filename: string,
        mimetype: string
    }

    let imageUrlList: Array<{ image: string }> = []
    let videoUrlList: Array<{ video: string }> = []

    req.files.forEach((item: file) => {
        if (item.mimetype.startsWith('image/')) {
            imageUrlList.push({ image: `images/events/${item.filename}` })
        }
        else if (item.mimetype.startsWith('video/')) {
            videoUrlList.push({ video: `videos/events/${item.filename}` })
        }
    })

    const newEvent = await prisma.events.create({
        data: {
            name: eventName,
            date: new Date(eventDate).toISOString(),
            location: eventLocation,
            imagesUrl: {
                createMany: {
                    data: imageUrlList
                }
            },
            videoUrl: {
                createMany: {
                    data: videoUrlList
                }
            }
        },
        include: {
            imagesUrl: true,
            videoUrl: true
        }
    })

    console.log('newEvent', newEvent)

    res.status(200).json({
        status: '200',
        message: 'Event created success',
    })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};