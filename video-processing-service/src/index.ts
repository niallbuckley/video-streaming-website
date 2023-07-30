import  express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello World!")
})

app.post("/process-video", (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath){
        res.status(400).send("Bad request: No input or output file path");
    }
    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")  // 360p video
        .on("end", () => {
            res.status(200).send("Video processing started");
        })
        .on("error", (err) => {
            // Possible run out of disk space
            console.log(`An error occured ${err.message}`);
            res.status(500).send(`Internal server Error: ${err.message}`);

        })
        .save(outputFilePath);

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});