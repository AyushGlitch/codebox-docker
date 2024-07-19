import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkObjects, copyObjectFolder, deleteObjects } from "./storeClient";


dotenv.config();


const app= express()
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    credentials: true, // Allow cookies to be sent
}))

app.use(express.json())


app.get("/", (req, res) => {
    console.log("Hello World")
})


app.post("/create", async (req, res) => {
    const { codeBoxId, language } = req.body;
    
    if (!codeBoxId) {
        res.status(400).json({ message: "codeBoxId is required" });
    }
    if (!language) {
        res.status(400).json({ message: "language is required" });
    }

    try {
        const codeBoxDataExists= await checkObjects(`codebox/${codeBoxId}`)
        if ( !codeBoxDataExists ) {
            await copyObjectFolder(`store-data/${language}`, `codebox/${codeBoxId}`)
            console.log(`CodeBox created successfully`)
        }
        else {
            console.log(`CodeBox already exists`)
        }
        
        res.status(200).json({ message: "CodeBox created successfully" });
    }
    catch (err) {
        console.error("Error in create fxn", err)
        res.status(500).json({ message: "Internal Server Error" });
    }
})


app.post("/delete", async (req, res) => {
    const { codeBoxId, language } = req.body;

    try {
        const isDeleted= await deleteObjects(`codebox/${codeBoxId}`)
        if ( isDeleted ) {
            console.log(`CodeBox deleted successfully`)
        }
        else {
            console.log(`CodeBox does not exist`)
        }

        res.status(200).json({ message: "CodeBox deleted successfully" });
    }
    catch (err) {
        console.error("Error in delete fxn", err)
        res.status(500).json({ message: "Internal Server Error" });
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    console.log(`http://localhost:${process.env.PORT}`)
})