import { Socket } from "socket.io-client"
import { File, RemoteFile, buildFileTree } from "./editor/utils/file-manager"
import { useEffect, useMemo } from "react";
import Sidebar from "./editor/components/sidebar";
import { FileTree } from "./editor/components/file-tree";
import { Code } from "./editor/editor/code";
import styled from "@emotion/styled";



export const Editor= (
    {
        files,
        selectedFile,
        socket,
        onSelect
    } : {
        files: RemoteFile[],
        selectedFile: File | undefined,
        socket: Socket,
        onSelect: (file: File) => void
    }
) => {

    const rootDir = useMemo(() => {
        return buildFileTree(files);
        }, [files]);
    
        useEffect(() => {
            if (!selectedFile) {
                onSelect(rootDir.files[0])
            }
        }, [selectedFile])
    
        return (
            <div>
                <Main>
                    <Sidebar>
                        <FileTree
                            rootDir={rootDir}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                        />
                    </Sidebar>
                    <Code socket={socket} selectedFile={selectedFile} />
                </Main>
            </div>
        );
}

const Main = styled.main`
    display: flex;
`;