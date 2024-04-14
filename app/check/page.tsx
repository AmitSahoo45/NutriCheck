'use client';

import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';

const CheckIndexPage: React.FC = () => {
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [imageSource, setImageSource] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const webcamRef = React.useRef<Webcam>(null);

    useEffect(() => {
        const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
        setIsMobile(isMobileDevice);
    }, []);

    const toggleWebcam = () => {
        setIsWebcamOpen((prevState) => !prevState);
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        setImageSource(imageSrc || null);

        if (imageSrc) {
            Tesseract.recognize(imageSrc, 'eng', {
                logger: (m) => console.log(m),
            }).then(({ data: { text } }) => {
                setExtractedText(text);
            });
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
                        facingMode: isMobile ? { exact: 'environment' } : 'user',
                    }}
                />
            )}
            <button onClick={toggleWebcam}>Toggle Camera</button>
            <button onClick={captureImage}>Capture Image</button>
            {imageSource && <img src={imageSource} alt="Captured" />}
            {extractedText && <p>Extracted Text: {extractedText}</p>}
        </div>
    )
}

export default CheckIndexPage