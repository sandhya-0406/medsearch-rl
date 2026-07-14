import { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export function UploadProvider({ children }) {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [metadata, setMetadata] = useState(null);

    const [domain, setDomain] = useState("Auto Detect");

    const [pipelineStatus, setPipelineStatus] = useState("Waiting");

    const [analysisRunning, setAnalysisRunning] = useState(false);

    const [results, setResults] = useState(null);

    const [uploadError, setUploadError] = useState(null);

    function clearUpload() {

        setSelectedFile(null);

        setPreview(null);

        setMetadata(null);

        setResults(null);

        setUploadError(null);

        setPipelineStatus("Waiting");

    }

    async function uploadAnalysis() {

        if (!selectedFile) {

            throw new Error("No file selected.");

        }

        return {

            id: Date.now(),

            image: preview,

            domain,

            metadata: metadata || {

                name: selectedFile.name,

                size: selectedFile.size,

                type: selectedFile.type

            }

        };

    }

    return (

        <UploadContext.Provider

            value={{

                selectedFile,
                setSelectedFile,

                preview,
                setPreview,

                metadata,
                setMetadata,

                domain,
                setDomain,

                pipelineStatus,
                setPipelineStatus,

                analysisRunning,
                setAnalysisRunning,

                results,
                setResults,

                uploadError,
                setUploadError,

                uploadAnalysis,

                clearUpload

            }}

        >

            {children}

        </UploadContext.Provider>

    );

}

export function useUpload() {

    return useContext(UploadContext);

}