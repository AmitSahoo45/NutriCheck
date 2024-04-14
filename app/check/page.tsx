'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Toast, Toaster, toast } from 'react-hot-toast'
import Image from 'next/image';

const CheckIndexPage: React.FC = () => {
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [imageSource, setImageSource] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    const webcamRef = React.useRef<Webcam>(null);

    const toggleWebcam = () => {
        setIsWebcamOpen((prevState) => !prevState);
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        setImageSource(imageSrc || null);

        if (imageSrc) {
            Tesseract
                .recognize(imageSrc, 'eng', {
                    logger: (m) => console.log(m),
                })
                .then(({ data: { text } }) => {
                    setExtractedText(text);
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setUploadedImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            Tesseract
                .recognize(imageUrl, 'eng', {
                    logger: (m) => console.log(m),
                })
                .then(({ data: { text } }) => {
                    setExtractedText(text);
                })
                .catch((error) => {
                    toast.error(error.message);
                })
        }
    };

    return (
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
            <button onClick={toggleWebcam}>Toggle Camera</button>
            <button onClick={captureImage}>Capture Image</button>
            {imageSource && <img src={imageSource} alt="Captured" />}
            {extractedText && <p>Extracted Text: {extractedText}</p>}
            <input type="file" onChange={handleImageUpload} />
            {uploadedImage && <Image
                src={URL.createObjectURL(uploadedImage)}
                alt="Uploaded"
                width={200}
                height={360}
            />}
            <Toaster />
        </div>
    )
}

export default CheckIndexPage