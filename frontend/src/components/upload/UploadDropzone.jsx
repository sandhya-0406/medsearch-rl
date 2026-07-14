import {
    UploadCloud,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

import { useDropzone } from "react-dropzone";

import { useUpload } from "../../context/UploadContext";
import UploadToolbar from "./UploadToolbar";

export default function UploadDropzone() {

    const {

        selectedFile,
        setSelectedFile,

        preview,
        setPreview,

        setMetadata,

        uploadError,
        setUploadError

    } = useUpload();

    function handleImage(file){

        if(!file) return;

        if(!file.type?.startsWith("image/")){

            setUploadError("Please upload a valid image file.");

            return;

        }

        setUploadError(null);

        setSelectedFile(file);

        setPreview(

            URL.createObjectURL(file)

        );

        setMetadata({

            name:file.name,

            size:(file.size/1024/1024).toFixed(2),

            type:file.type,

            uploaded:new Date().toLocaleTimeString()

        });

    }

    const {

        getRootProps,

        getInputProps,

        isDragActive

    } = useDropzone({

        accept:{

            "image/*":[]

        },

        multiple:false,

        onDrop:(accepted,rejected)=>{

            if(rejected.length){

                setUploadError(

                    "Only PNG and JPG images are supported."

                );

                return;

            }

            handleImage(

                accepted[0]

            );

        }

    });

    return(

        <div

            {...getRootProps()}

            className="

                elevated-card

                rounded-[30px]

                p-12

                cursor-pointer

                border-2

                border-dashed

                transition-all

                duration-300

            "

            style={{

                borderColor:

                    isDragActive

                    ?

                    "var(--primary)"

                    :

                    "var(--border)",

                transform:

                    isDragActive

                    ?

                    "scale(1.01)"

                    :

                    "scale(1)",

                background:

                    isDragActive

                    ?

                    "rgba(34,211,238,.05)"

                    :

                    "transparent"

            }}

        >

            <input

                {...getInputProps()}

            />

            <div

                className="

                    flex

                    flex-col

                    items-center

                    text-center

                "

            >

                {

                    selectedFile

                    ?

                    <CheckCircle2

                        size={60}

                        className="text-emerald-400"

                    />

                    :

                    <UploadCloud

                        size={60}

                        className="text-cyan-400"

                    />

                }

                <h2

                    className="

                        text-2xl

                        font-bold

                        mt-6

                    "

                >

                    {

                        selectedFile

                        ?

                        "Image Uploaded"

                        :

                        "Upload Medical Image"

                    }

                </h2>

                <p

                    className="mt-3"

                    style={{

                        color:"var(--muted)"

                    }}

                >

                    {

                        selectedFile

                        ?

                        selectedFile.name

                        :

                        "Drag & Drop or Click to Browse"

                    }

                </p>

                {

                  selectedFile

                  ?

                  <UploadToolbar/>

                  :

                  <button

                  type="button"

                  className="

                  mt-8

                  px-8

                  py-3

                  rounded-xl

                  font-semibold

                  text-white

                  "

                  style={{

                  background:

                  "linear-gradient(135deg,var(--primary),var(--secondary))"

                  }}

                  >

                  Browse Files

                  </button>

                  }

                {

                    uploadError &&

                    <div

                        className="

                            mt-6

                            flex

                            items-center

                            gap-2

                            text-red-400

                        "

                    >

                        <AlertCircle

                            size={18}

                        />

                        {uploadError}

                    </div>

                }

                <p

                    className="

                        mt-5

                        text-sm

                    "

                    style={{

                        color:"var(--muted)"

                    }}

                >

                    PNG • JPG • JPEG

                </p>

            </div>

        </div>

    );

}