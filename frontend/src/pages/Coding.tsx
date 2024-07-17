import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Socket, io } from "socket.io-client"
import { File, RemoteFile, Type } from "../components/editor/utils/file-manager"
import { Editor } from "../components/Editor"
import { TerminalComp } from "../components/Terminal"


const useSocket = (codeBoxId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect( () => {
        const ws= io(`ws://localhost:3001`, {
            query: {
                "replId": codeBoxId
            }
        })
        setSocket(ws)
        console.log("Socket connected", ws)

        return ( () => {
            ws.disconnect()
        } )

    }, [codeBoxId] )

    return socket
}


function Coding() {
    const [codeBoxCreated, setCodeBoxCreated] = useState(false)
    const [searchParams]= useSearchParams()
    const codeBoxId= searchParams.get('codeBoxId')
    const language= searchParams.get('lang')

    useEffect( () => {
        if (codeBoxId && language) {
            axios.post(`${import.meta.env.VITE_ORCHESTRATOR_URL}/start`, { codeBoxId, language })
                .then( () => setCodeBoxCreated(true) )
                .catch( (err) => console.error(err) )
        }
    }, [] )

    if (!codeBoxCreated) {
        return (
            <div>
                <h1>Creating CodeBox...</h1>
            </div>
        )
    }

    return (
        <FinalCodingPage codeBoxId={codeBoxId!} language={language!} />
    )
}


function FinalCodingPage( {codeBoxId, language} : {codeBoxId: string, language: string} ) {
    console.log(codeBoxId, language)
    const [loaded, setLoaded]= useState(false)
    const socket= useSocket(codeBoxId)
    const [fileStructure, setFileStructure]= useState<RemoteFile[]>([])
    const [selectedFile, setSelectedFile]= useState<File | undefined>(undefined)
    // const [showOutput, ]


    useEffect ( () => {
        if (socket) {
            socket.on('loaded', ({rootContent} : {rootContent: RemoteFile[]}) => {
                setLoaded(true)
                setFileStructure(rootContent)
            })
        }

    }, [socket] )


    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });
        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };
    
    if (!loaded) {
        return "Loading...";
    }

    return (
        <div className="mt-10 w-full flex flex-col gap-5 justify-between">
            <div className="border-2 h-[400px] overflow-auto">
                <Editor socket={socket!} selectedFile={selectedFile} files={fileStructure} onSelect={onSelect} />
            </div>

            <div className="border-2 h-[230px]">
                <TerminalComp socket={socket!} />
            </div>
        </div>
    )
}

export default Coding