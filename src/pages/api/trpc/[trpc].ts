import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession, IronSessionOptions } from "iron-session";
// export API handler
const nextApiHandler =  createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  
  const session = await getIronSession(req, res, {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },})
  // Modify `req` and `res` objects here
  // In this case, we are enabling CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // If you need to make authenticated CORS calls then
  // remove what is above and uncomment the below code
  // Allow-Origin has to be set to the requesting domain that you want to send the credentials back to
  // res.setHeader('Access-Control-Allow-Origin', 'https://vatsalyaseva-p2snlpt74-vatsalyaseva.vercel.app');
  // res.setHeader('Access-Control-Request-Method', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  // res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Referrer-Policy', 'no-referrer');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // if (user?.admin !== "true") {
  //   // unauthorized to see pages inside admin/
  //   return NextResponse.redirect(new URL('/unauthorized', req.url)) // redirect to /unauthorized page
  // }
  console.log(session)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }
  // pass the (modified) req/res to the handler
  return nextApiHandler(req, res);
}