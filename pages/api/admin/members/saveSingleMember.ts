
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import prisma from '../../../../prisma'

import nextConnect from 'next-connect';
import multer from 'multer';


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/members')
        },
        filename: (req, file, cb) => cb(null, `${req.body.memberName.slice(0, 5)}_${file.originalname}`),
    }),
});

const apiRoute = nextConnect<NextApiRequest & {files:Express.Multer.File[]}, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('memberImage');
apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
    const { memberName, phoneNumber, email, role } = req.body
    console.log(req.files)
    type file = {
        destination: string,
        filename: string,
        mimetype: string
    }

    // let imageUrlList: Array<{ image: string }> = []

    // req.files.forEach((item: file) => {
    //     if (item.mimetype.startsWith('image/')) {
    //         imageUrlList.push({ image: `members/${item.filename}` })
    //     }
    // })

    // const newMember = await prisma.members.create({
    //     data: {
    //         name: memberName,
    //         phoneNumber: phoneNumber,
    //         email: email,
    //         role: role,
    //         imagePath: imageUrlList[0]
    //     },
    // })

    // // console.log('newMember', newMember)

    res.status(200).json({
        code: 200,
        data: ''
    })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};