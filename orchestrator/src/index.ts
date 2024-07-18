import express from "express";
import cors from "cors";
import Docker from "dockerode"


const app = express();
app.use(express.json());
app.use(cors());


const docker = new Docker({ socketPath: '/home/ayush/.docker/desktop/docker.sock' });


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

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});