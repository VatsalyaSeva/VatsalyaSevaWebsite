// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import { prisma } from '../../../../server/db'

import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images/events/covers');
        },
        filename: (req, file, cb) => cb(null, `Event_Cover_${new Date().toISOString().slice(0,10)}_${file.originalname}`),
    }),
});

const apiRoute = nextConnect<NextApiRequest & {files:Express.Multer.File[]}, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('coverImage');
apiRoute.use(uploadMiddleware);


apiRoute.post(async (req, res) => {
    const { id } = req.body
    let files = req.files;
    let coverImage = '';

    let image = await prisma.events.findFirst({
        where:{
            id:id
        },
        select:{
            coverImage:true
        },
    }) 

    if (files?.length > 0) {
        const coverImageName = `Event_Cover_${new Date().toISOString().slice(0,10)}_${files[0].originalname}`;
        coverImage = `/images/events/covers/${coverImageName}`;
      
        if (typeof image?.coverImage === 'string' && image.coverImage.length > 0) {
          try {
            fs.unlinkSync(`./public${image.coverImage}`);
          } catch (err) {
            console.error(`Error deleting file ${image.coverImage}: ${err}`);
          }
        }
      }

    let ac = await prisma.events.update({
        where:{
            id:id
        },
        data:{
            coverImage:coverImage
        },
    }) 

    // let ac = await prisma.additionalImages.create({
    //     data:{
    //         image:coverImage,
    //         Events:{
    //             connect:{
    //                 id:id
    //             }
    //         }
    //     },
    // }) 

    if(ac){
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