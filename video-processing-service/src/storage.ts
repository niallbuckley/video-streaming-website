// TCS file interactions 
import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage()

const rawVideoBucketName = "niall-site-raw-videos";
const processedVideoBucketName = "niall-site-processed-videos";

const localRawVideoPath = "./raw_videos";
const localProcessedVideoPath = "./processed_videos";


/**
 * Creates the local directories for raw and processed videos.
 */
export function setUpDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName:string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360")  // 360p video
            .on("end", () => {
                console.log("Processing finished successfully");
                resolve();
            })
            .on("error", function (err: any) {
                // Possible run out of disk space
                console.log(`An error occured ${err.message}`);
                reject(err);
            })
            .save(`${localRawVideoPath}/${processedVideoName}`);
    });
}



/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
      .file(fileName)
      .download({
        destination: `${localRawVideoPath}/${fileName}`,
      });
  
    console.log(
      `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
  }

/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProceesedVideo(fileName: string){
  const bucket = storage.bucket(processedVideoBucketName)

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName
  });
  console.log(
    `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
  );

  // Set the video to be publicly readable
  await bucket.file(fileName).makePublic();
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)){
      fs.unlink(filePath, (err) => {
        if (err){
          console.log(`Failed to delete file at ${filePath}`);
          reject(err);
        }
        else{
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      })
    }
    else{
      console.log(`File not found at ${filePath}, skipping the delete`);
      resolve();
    }
  })
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
* @param fileName - The name of the file to delete from the
* {@link localProcessedVideoPath} folder.
* @returns A promise that resolves when the file has been deleted.
*/
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}