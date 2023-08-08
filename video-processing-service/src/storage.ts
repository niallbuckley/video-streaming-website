// TCS file interactions 
import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";
import { rejects } from "assert";

const storage = new Storage()

const rawVideoBucketName = "niall-site-raw-videos";
const processedVideoBucketName = "niall-site-processed-videos";

const localRawVideoPath = "./raw_videos";
const localProcessedVideoPath = "./processed_videos";

export function setUpDirectories() {

}

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