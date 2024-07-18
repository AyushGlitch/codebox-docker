import { Server, Socket } from "socket.io";
import { TerminalManager } from "./pty";
import { Server as HttpServer } from "http";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { fetchMinioFolder, saveToMinio } from "./store";




const terminalManager = new TerminalManager();

export function initWs(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", async (socket) => {
        // Auth checks should happen here
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        console.log(`${host?.split('.')[0]}`)

        // Split the host by '.' and take the first part as replId
        const replId= socket.handshake.query.replId as string;
        console.log(`replId is ${replId}`);
        // const replId = host?.split('.')[0];

        await fetchMinioFolder(`codebox/${replId}/`, `./workspace`);
    
        if (!replId) {
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }
        
        initHandlers(socket, replId);

        socket.emit("loaded", {
            rootContent: await fetchDir("./workspace", "")
        });

    });
}

function initHandlers(socket: Socket, replId: string) {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("fetchDir", async (dir: string, callback) => {
        const dirPath = `./workspace/${dir}`;
        const contents = await fetchDir(dirPath, dir);
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = `./workspace/${filePath}`;
        const data = await fetchFileContent(fullPath);
        callback(data);
    });

    // TODO: contents should be diff, not full file
    // Should be validated for size
    // Should be throttled before updating S3 (or use an S3 mount)
    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath =  `./workspace/${filePath}`;
        await saveFile(fullPath, content);
        await saveToMinio(`codebox/${replId}`, filePath, content);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.createPty(socket.id, replId, (data, id) => {
            socket.emit('terminal', {
                data: Buffer.from(data,"utf-8")
            });
        });
    });
    
    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        terminalManager.write(socket.id, data);
    });

}