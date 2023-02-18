import {createClient} from '@sanity/client'
import {basename} from 'path'
import {createReadStream} from 'fs'

let date = new Date().toISOString().slice(0,10)

export const sanityClient = createClient({
  projectId: '50fcbg30',
  dataset: 'production',
  token: 'skpthy3aPuKCahU9E9nhHt2bAXxqzNx35gbtAvIKx1jdKlcRK9yH8cOFMdQfUDX4f5IdJpQeZLAFvXQXKcdv2d28E6qAqA6AXE7zG7iOj0YfGCKCiTnELiBIPp4uq7DfrQ11OnnJ8lA2tSGdNJxe2XFKSNGFTHv7GTrtdYej5fDm7BF6Xfm4',
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: date
})


// const filePath = '/Users/mike/images/bicycle.jpg'

// client.assets
//   .upload('image', createReadStream(filePath), {
//     filename: basename(filePath)
//   })
//   .then(imageAsset => {
//     // Here you can decide what to do with the returned asset document. 
//     // If you want to set a specific asset field you can to the following:

//   })
//   .then(() => {
//     console.log("Done!");
//   })