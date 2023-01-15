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

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

const uploadMiddleware = upload.array('memberImage');
apiRoute.use(uploadMiddleware);

type file = {
    destination: string,
    filename: string,
    mimetype: string
}

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { memberName, phoneNumber, email, role } = req.body
    const { id } = req.query
    const file: file[] = req.files

    if (typeof (id) == 'string') {
        const member = await prisma.members.findFirst({
            where: {
                id: parseInt(id)
            }
        })
        if (member) {
            const updatedMember = await prisma.members.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: memberName != undefined ? memberName : member.name,
                    phoneNumber: phoneNumber != undefined ? phoneNumber : member.phoneNumber,
                    email: email != undefined ? email : member.email,
                    role: role != undefined ? role : member.role,
                    imagePath: file.length != 0 ? `members/${file[0].filename}` : member.imagePath
                },
            })
            if (updatedMember) {
                res.status(200).json({
                    code: 200,
                    data: updatedMember
                })
            }
            else {
                res.status(400).json({
                    status: '400',
                    message: 'Member not updated',
                })
            }
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'Member not found',
            })
        }
    }
    else {
        res.status(404).json({
            code: 404,
            message: 'Id not not Found',
        })
    }

})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};