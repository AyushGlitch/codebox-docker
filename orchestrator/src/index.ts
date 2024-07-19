import express from "express";
import cors from "cors";
import Docker from "dockerode"
import { PrismaClient } from "@prisma/client";


const app = express();
app.use(express.json());
app.use(cors());


const docker = new Docker({ socketPath: '/home/ayush/.docker/desktop/docker.sock' });
const prisma = new PrismaClient()


app.post("/start", async (req, res) => {
    const { codeBoxId, language } = req.body;

    try {
        const container= await docker.createContainer({
            Image: "glitchayush/codebox-docker-engine",
            name: codeBoxId,
            ExposedPorts: {
                '3000/tcp': {},
                '3001/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '3000/tcp': [{ HostPort: '3000' }],
                    '3001/tcp': [{ HostPort: '3001' }]
                }
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    'my-network': {}
                }
            }
        })
        await container.start()

        await prisma.codebox.upsert({
            where: {
                codeboxid: codeBoxId
            },
            update: {
                status: "running"
            },
            create: {
                codeboxid: codeBoxId,
                containerName: codeBoxId,
                language: language,
                status: "running"
            }
        })

        console.log("Container started successfully");
        // @ts-ignore
        // .then(container => container.start())
        // .then(() => {
        //     console.log("Container started successfully");
        // })

        res.status(200).send({ message: "Resources created successfully" });

    } catch (error) {
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
});


app.post("/stop", async (req, res) => {
    const { codeBoxId } = req.body

    try {
        const container= docker.getContainer(codeBoxId)
        await container.stop()
        await container.remove()

        await prisma.codebox.update({
            where: {
                codeboxid: codeBoxId
            },
            data: {
                status: "stopped"
            }
        })

        console.log("Container stopped and removed successfully");
        res.status(200).send({ message: "Resources deleted successfully" });
    }
    catch (error) {
        console.error("Failed to delete resources", error);
    }
})


app.get("/containers", async (req, res) => {
    try {
        const data= await prisma.codebox.findMany({})
        // console.log(data)
        res.status(200).send(data);
    }
    catch (error) {
        console.error("Failed to fetch containers", error);
        res.status(500).send({ message: "Failed to fetch containers" });
    }
})


app.post("/deleteCodebox", async (req, res) => {
    const { codeBoxId, language } = req.body;

    try {
        await prisma.codebox.delete({
            where: {
                codeboxid: codeBoxId
            }
        })

        res.status(200).send({ message: "CodeBox deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting CodeBox", err);
        res.status(500).send({ message: "Failed to delete CodeBox" });
    }
})


const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});