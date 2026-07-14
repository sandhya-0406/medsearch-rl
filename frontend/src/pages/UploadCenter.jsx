import { useNavigate } from "react-router-dom";

import UploadHeader from "../components/upload/UploadHeader";
import UploadDropzone from "../components/upload/UploadDropzone";
import UploadPreview from "../components/upload/UploadPreview";
import UploadOptions from "../components/upload/UploadOptions";
import RunAnalysisCard from "../components/upload/RunAnalysisCard";
import RecentUploads from "../components/upload/RecentUploads";

import useUpload from "../hooks/UseUpload";
import useExplorer from "../hooks/useExplorer";

export default function UploadCenter() {

    const navigate = useNavigate();

    const {

        selectedFile,

        uploadAnalysis

    } = useUpload();

    const {

        loadAnalysis

    } = useExplorer();

    async function handleRunAnalysis() {

        if (!selectedFile) return;

        const analysis = await uploadAnalysis();

        loadAnalysis(analysis);

        navigate("/agent-explorer");

    }

    return (

        <div

            className="

            max-w-7xl

            mx-auto

            p-10

            space-y-8

            "

        >

            <UploadHeader />

            <UploadDropzone />

            <div

                className="

                grid

                lg:grid-cols-2

                gap-8

                "

            >

                <UploadPreview />

                <UploadOptions />

            </div>

            <div

                className="

                grid

                lg:grid-cols-2

                gap-8

                "

            >

                <RunAnalysisCard

                    onRun={handleRunAnalysis}

                />

                <RecentUploads />

            </div>

        </div>

    );

}