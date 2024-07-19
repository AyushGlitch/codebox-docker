import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initWs } from "./ws";
import { fetchMinioFolder } from "./store";


dotenv.config()


const app = express();
app.use(cors({
  origin: "*", // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  credentials: true, // Allow cookies to be sent
}))
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World");
});


app.get("/copy", async (req, res) => {
  const { replId } = req.query.replId as { replId: string };

  try {
    await fetchMinioFolder(`codebox/${replId}/`, `./workspace`);
    res.status(200).send({ message: "Copied successfully" });
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error copying" });
  }
} )


const httpServer = createServer(app);
initWs(httpServer);


const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});