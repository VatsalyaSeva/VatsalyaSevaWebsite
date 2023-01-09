// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import prisma from '../../../prisma'
import nextConnect from 'next-connect';

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    // Handle any other HTTP method
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.post(async (req, res) => {
    const { id } = req.body

    const vacancy = await prisma.vacancy.findFirst({
        where: id,
    })

    if (vacancy) {
        const allApplicants = await prisma.applecants.findMany({
            where: {
                vacancyId: vacancy.id
            }
        })

        allApplicants.forEach(element => {
            fs.remove(`./public/${element.cvFilePath}`, err => {
                if (err) return console.error(err)
                console.log('success!')
            })
        });

        const applicants = await prisma.applecants.deleteMany({
            where: {
                vacancyId: vacancy.id
            }
        })
        const deleteVacancy = await prisma.vacancy.delete({
            where: {
                id: vacancy?.id
            }
        })

    }

    res.status(200).json({
        status: '200',
        message: 'Job deleted success',
    })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: true, // Disallow body parsing, consume as stream
    },
};