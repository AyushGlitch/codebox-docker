import { Client as MinioClient } from "minio";
import fs from "fs";
import path from "path";

const minioClient = new MinioClient({
    endPoint: 'localhost',
    port: 9000,
    accessKey: "xcrVtD8yusfX8vc6j9gY",
    secretKey: "arhqi6H7H9slSeMYp7d0NrHSMvtgKntHlOJTy7NF",
    useSSL: false
});

export const fetchMinioFolder = async (key: string, localPath: string): Promise<void> => {
    const bucketName = process.env.STORE_BUCKET ?? "";
    
    const stream = minioClient.listObjectsV2(bucketName, key, true);

    for await (const obj of stream) {
        const fileKey = obj.name;
        const data = await minioClient.getObject(bucketName, fileKey);
        
        const chunks: Buffer[] = [];
        for await (const chunk of data) {
            chunks.push(chunk);
        }

        const fileData = Buffer.concat(chunks);
        const filePath = `${localPath}/${fileKey.replace(key, "")}`;
        //@ts-ignore
        await writeFile(filePath, fileData);
    }
};

export async function copyMinioFolder(sourcePrefix: string, destinationPrefix: string): Promise<void> {
    try {
        const bucketName = process.env.STORE_BUCKET ?? "";
        const stream = minioClient.listObjectsV2(bucketName, sourcePrefix, true);
        
        for await (const obj of stream) {
            const sourceKey = obj.name;
            const destinationKey = sourceKey.replace(sourcePrefix, destinationPrefix);
            
            await minioClient.copyObject(bucketName, destinationKey, `${bucketName}/${sourceKey}`);
            console.log(`Copied ${sourceKey} to ${destinationKey}`);
        }
    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

function writeFile(filePath: string, fileData: Buffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
        await createFolder(path.dirname(filePath));

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    });
}

function createFolder(dirName: string) {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}

export const saveToMinio = async (key: string, filePath: string, content: string): Promise<void> => {
    const bucketName = process.env.STORE_BUCKET ?? "";
    const objectName = `${key}${filePath}`;

    await minioClient.putObject(bucketName, objectName, content);
    console.log("Saved to Minio:", objectName);
}
