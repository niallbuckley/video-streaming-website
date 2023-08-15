import  express from "express";
import { uploadProceesedVideo, downloadRawVideo, deleteRawVideo, deleteProcessedVideo, convertVideo, setUpDirectories } from './storage'

setUpDirectories();

const app = express();
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello World!")
})

app.post("/process-video", async (req, res) => {
  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Download the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  // Process the video into 360p
  try { 
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    return res.status(500).send('Processing failed');
  }
  
  // Upload the processed video to Cloud Storage
  await uploadProceesedVideo(outputFileName);

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send('Processing finished successfully');
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});