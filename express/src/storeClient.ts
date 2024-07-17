import * as Minio from 'minio'


const storeClient= new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    accessKey: "xcrVtD8yusfX8vc6j9gY",
    secretKey: "arhqi6H7H9slSeMYp7d0NrHSMvtgKntHlOJTy7NF",
    useSSL: false
})


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