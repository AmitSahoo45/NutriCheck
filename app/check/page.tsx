'use client';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Toast, Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';

const CheckIndexPage: React.FC = () => {
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [imageSource, setImageSource] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const webcamRef = React.useRef<Webcam>(null);

    const toggleWebcam = () => {
        setIsWebcamOpen((prevState) => !prevState);
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        setImageSource(imageSrc || null);
        if (imageSrc) {
            setLoading(true);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setUploadedImage(file);
        if (file) {
            setLoading(true);
            toast.loading('Uploading image...', { duration: 1500 });
            const imageUrl = URL.createObjectURL(file);
            Tesseract.recognize(imageUrl, 'eng', {
                logger: (m) => console.log(m),
            })
                .then(({ data: { text } }) => {
                    setExtractedText(text);
                    toast.success('Text extracted successfully!');
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (imageSource) {
            Tesseract.recognize(imageSource, 'eng', {
                logger: (m) => console.log(m),
            })
                .then(({ data: { text } }) => {
                    setExtractedText(text);
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [imageSource]);

    return (
        <div className="flex flex-col items-center container pt-3">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded"
                onClick={toggleWebcam}
            >
                Toggle Camera
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded"
                onClick={captureImage}
            >
                Capture Image
            </button>
            <div>
                {isWebcamOpen && (
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            width: 640,
                            height: 480,
                            facingMode: 'user',
                        }}
                    />
                )}
            </div>
            {loading && <p>Extracting text...</p>}
            {imageSource && <img src={imageSource} alt="Captured" />}
            {extractedText && <p>Extracted Text: {extractedText}</p>}
            <div className="flex flex-col items-center container pt-3">
                <input type="file" onChange={handleImageUpload} />
            </div>
            {uploadedImage && (
                <Image
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded"
                    width={200}
                    height={360}
                />
            )}
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    }
                }}
            />
        </div>
    );
};

export default CheckIndexPage;