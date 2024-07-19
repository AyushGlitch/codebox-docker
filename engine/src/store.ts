import { Client as MinioClient } from "minio";
import fs from "fs";
import path from "path";
const { execSync } = require('child_process');

// const minioClient = new MinioClient({
//     endPoint: 'localhost',
//     port: 9000,
//     accessKey: "xcrVtD8yusfX8vc6j9gY",
//     secretKey: "arhqi6H7H9slSeMYp7d0NrHSMvtgKntHlOJTy7NF",
//     useSSL: false
// });


const minioClient = new MinioClient({
    endPoint: 'minio2',
    port: 9000,
    useSSL: false,
    accessKey: '2KB3SpO8E9vk5bmU9brK',
    secretKey: 'uvbKZoElanKkUxYTuIDs2SJisvbQLgfs5Zej9s2Y'
});


export const fetchMinioFolder = async (key: string, localPath: string): Promise<void> => {
  try {
    const bucketName = process.env.STORE_BUCKET ?? "";
    console.log('LocalPath:', localPath);
    console.log('Minio Key:', key);
  
    const stream = minioClient.listObjectsV2(bucketName, key, true);
  
    for await (const obj of stream) {
      const fileKey = obj.name;
      const data = await minioClient.getObject(bucketName, fileKey);
      const chunks: Buffer[] = [];
      for await (const chunk of data) {
        chunks.push(chunk);
      }
      const fileData = Buffer.concat(chunks);
      const filePath = path.join(localPath, fileKey.replace(key, ""));
      console.log('File Path:', filePath);
  
      // Ensure the directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
      // Write the file
      fs.writeFileSync(filePath, fileData);
  
      // Make the file executable if it's run.sh
      if (path.basename(filePath) === 'run.sh') {
        fs.chmodSync(filePath, '777');
        console.log('Made run.sh executable');
      }
    }
  
    console.log('All files downloaded successfully');
  
    // Run the script
    const runScriptPath = path.join(localPath, 'run.sh');
    console.log('Run Script Path:', runScriptPath);
  
    if (fs.existsSync(runScriptPath)) {
      console.log('Making run.sh executable...');
      fs.chmodSync(runScriptPath, '777');

      console.log('Running run.sh...');
      execSync(`/bin/bash ${runScriptPath}`, { stdio: 'inherit' });
    } 
    else {
      console.log('run.sh not found in the downloaded files');
    }
  } 

  catch (error) {
    console.error('Error executing run.sh:', error);
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
