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
    const { eventId } = req.body

    const event = await prisma.events.findFirst({
        where: eventId,
        include: {
            imagesUrl: true,
            videoUrl: true
        }
    })

    // console.log('event', event)
    // console.log('__dirname', __dirname)

    event?.imagesUrl.forEach((item) => {
        fs.remove(`./public/${item.image}`, err => {
            if (err) return console.error(err)
            console.log('success!')
        })
    })

    event?.videoUrl.forEach((item) => {
        fs.remove(`./public/${item.video}`, err => {
            if (err) return console.error(err)
            console.log('success!')
        })
    })


    const deleteEvent = await prisma.events.delete({
        where: {
            id: event?.id
        },
        // select: {
        //     videoUrl: true,
        //     imagesUrl: true
        // }
    })

    // const deleteImage = await prisma.image.deleteMany({
    //     where: {
    //         eventsId: eventId
    //     }
    // })

    // const deleteVideo = await prisma.video.deleteMany({
    //     where: {
    //         eventsId: eventId
    //     }
    // })

    console.log('event delete', deleteEvent)

    res.status(200).json({
        status: '200',
        message: 'Event deleted success',
    })
})

export default apiRoute

export const config = {
    api: {
        bodyParser: true, // Disallow body parsing, consume as stream
    },
};