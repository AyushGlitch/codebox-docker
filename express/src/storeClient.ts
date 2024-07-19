import * as Minio from 'minio'
import dotenv from 'dotenv'

dotenv.config()


// const storeClient= new Minio.Client({
//     endPoint: 'localhost',
//     port: 9000,
//     accessKey: "xcrVtD8yusfX8vc6j9gY",
//     secretKey: "arhqi6H7H9slSeMYp7d0NrHSMvtgKntHlOJTy7NF",
//     useSSL: false
// })


const storeClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.STORE_ACCESS_KEY!,
    secretKey: process.env.STORE_SECRET_KEY!
});


export const checkObjects= async (dest: string) => {
    try {
        const objectsStream= await storeClient.listObjectsV2(`${process.env.STORE_BUCKET}`, dest, true)
        const objects: string[] = []

        for await (const obj of objectsStream) {
            const fileKey= obj.name;
            objects.push(obj)
        }

        if (objects.length > 0) {
            return true
        }
        else {
            return false
        }
    }
    catch (err) {
        console.error("Error in checkObjects fxn", err)
    }
}


export const deleteObjects= async (prefix: string) => {
    try {
        const objects: string[] = []
        const objectsStream= await storeClient.listObjectsV2(`${process.env.STORE_BUCKET}`, prefix, true)

        for await (const obj of objectsStream) {
            objects.push(obj.name!)
        }

        await storeClient.removeObjects(`${process.env.STORE_BUCKET}`, objects)

        return true
    }
    catch (err) {
        console.error("Error in deleteObjects fxn", err)
        return false
    }
}


export const copyObjectFolder= async (srcPrefix: string, dest: string) => {
    try {
        const buckets= await storeClient.listBuckets()
        // console.log(buckets)

        const objectsStream= await storeClient.listObjectsV2(`${process.env.STORE_BUCKET}`, srcPrefix, true)
        const objects: Minio.BucketItem[] = []
        await new Promise( (resolve, reject) => {
            objectsStream.on('data', (obj) => {
                objects.push(obj)
            })

            objectsStream.on('end', resolve)
        } )
        
        // console.log(objects)

        await Promise.all( objects.map( async (obj) => {
            const destination= obj.name?.replace(srcPrefix, dest)
            await storeClient.copyObject(`${process.env.STORE_BUCKET}`, destination!, `/${process.env.STORE_BUCKET}/${obj.name}`)
        } ) )
    }
    catch (error) {
        console.error("Error in copyObjectFolder fxn", error)
    }
}