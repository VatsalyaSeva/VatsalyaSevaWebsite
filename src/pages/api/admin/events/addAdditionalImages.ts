// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import { prisma } from '../../../../server/db'

import nextConnect from 'next-connect';
import multer from 'multer';
import events from '../../../events/[id]';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/events/images');
        },
        filename: (req, file, cb) => {
            let time = new Date().toISOString().slice(0,10)
            let fileName = file.originalname
            cb(null, `Event_Image_${time}_${fileName}`)
        },
    }),
});

const apiRoute = nextConnect<NextApiRequest & {files:Express.Multer.File[]}, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('additionalImage');
apiRoute.use(uploadMiddleware);


apiRoute.post(async (req, res) => {
    const { id } = req.body
    let files = req.files;
    let imageUrlList: Array<{ image: string }> = []

    files.forEach((item) => {
        let time = new Date().toISOString().slice(0,10)
        let fileName = item.originalname
        imageUrlList.push({ image: `images/events/images/Event_Image_${time}_${fileName}`})
    })

    let data = await prisma.events.update({
        where:{id:id},
        include:{additionalImages:true},
        data:{
            additionalImages:{
                create:imageUrlList
            }
        }
    })

    if(data){
        res.status(200).json({
            code:200,
            message: 'Event created success',
        })
    }

})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};