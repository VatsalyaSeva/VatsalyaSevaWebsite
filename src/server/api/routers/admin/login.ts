// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../prisma'

import { adminUser, Prisma } from '@prisma/client'

type Data = {
  status: string
  message: string,
}

type Error = {
  code: string,
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method == 'POST') {

    const { email, password } = req.body
    console.log(email)
    console.log(password)
    if (email.length == 0 || password.length == 0) {
      res.status(404).json({
        code: '404',
        message: `${email.length == 0 && 'Email key,'} ${password.length == 0 && 'Password key'} must not to be empty`
      })
    }
    else {

      const user = await prisma.adminUser.findFirst({
        where: {
          email: email,
          password: password
        }
      })
      // console.log(user)
      if (user) {
        res.status(200).json({
          status: '200',
          message: 'login success',
        })
      }
      else {
        res.status(404).json({
          code: '404',
          message: 'Wrong admin details'
        })
      }
    }
  }
  else {
    res.status(500).json({
      code: '500',
      message: 'Method not allowed'
    })
  }
}
