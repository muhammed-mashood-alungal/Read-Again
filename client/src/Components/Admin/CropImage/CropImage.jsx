import React, { useEffect, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropImage.css';

const CropImage = ({ isOpen, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const generateCroppedImage = (crop, imgRef) => {
        if (!crop || !imgRef.current) return null;

        const canvas = document.createElement('canvas');
        const image = imgRef.current;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelCrop = {
            x: crop.x * scaleX,
            y: crop.y * scaleY,
            width: crop.width * scaleX,
            height: crop.height * scaleY,
        };


        const outputSize = 300;
        canvas.width = outputSize;
        canvas.height = outputSize;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            outputSize,
            outputSize
        );

        return canvas;
    };

    const handleImageLoad = (image) => {
        imgRef.current = image;

        if (!isInitialized) {
            const { width, height } = image;


            const initialSize = Math.min(width, height) / 3;


            const x = (width - initialSize) / 2;
            const y = (height - initialSize) / 2;

            const initialCrop = {
                unit: 'px',
                width: initialSize,
                height: initialSize,
                x: x,
                y: y,
                aspect: 1
            };

            setCrop(initialCrop);
            setCompletedCrop(initialCrop);
            setIsInitialized(true);
        }
    };

    const resetStates = () => {
        setCrop(null);
        setCompletedCrop(null);
        setPreviewUrl(null);
        setIsInitialized(false);
        imgRef.current = null;
    };

    const handleClose = () => {
        resetStates();
        onClose();
    };

    const handlePreviewClick = () => {
        if (!completedCrop || !imgRef.current) return;

        const canvas = generateCroppedImage(completedCrop, imgRef);
        if (!canvas) return;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;

                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }

                const newPreviewUrl = URL.createObjectURL(blob);
                setPreviewUrl(newPreviewUrl);
            },
            'image/jpeg',
            1
        );
    };

    const handleSaveClick = () => {
        if (!completedCrop || !imgRef.current) return;

        const canvas = generateCroppedImage(completedCrop, imgRef);
        if (!canvas) return;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], imageSrc.name, { type: imageSrc.type });
                onCropComplete(file);
            },
            'image/jpeg',
            1
        );
    };

    const handleCropChange = (newCrop) => {
        if (imgRef.current) {
            const { width: imgWidth, height: imgHeight } = imgRef.current;


            let adjustedCrop = { ...newCrop };

            if (adjustedCrop.x < 0) adjustedCrop.x = 0;
            if (adjustedCrop.y < 0) adjustedCrop.y = 0;


            if (adjustedCrop.x + adjustedCrop.width > imgWidth) {
                adjustedCrop.width = imgWidth - adjustedCrop.x;
                adjustedCrop.height = adjustedCrop.width;
            }
            if (adjustedCrop.y + adjustedCrop.height > imgHeight) {
                adjustedCrop.height = imgHeight - adjustedCrop.y;
                adjustedCrop.width = adjustedCrop.height;
            }


            const minSize = 50
            if (adjustedCrop.width < minSize) {
                adjustedCrop.width = minSize;
                adjustedCrop.height = minSize;
            }

            setCrop(adjustedCrop);
        } else {
            setCrop(newCrop);
        }
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="">
                    <div className="react-crop-container">
                        <div>
                            <div>
                                <h3>Crop Image</h3>
                                <button onClick={handleSaveClick} className='crop-btn'>
                                    Save
                                </button>
                            </div>

                            <ReactCrop
                                crop={crop}
                                onChange={handleCropChange}
                                onComplete={(c) => {
                                    setCompletedCrop(c);
                                }}
                                aspect={1}
                                minWidth={50}
                                ruleOfThirds
                            >
                                <img
                                    ref={imgRef}
                                    src={URL.createObjectURL(imageSrc)}
                                    alt="Crop me"
                                    className='cropping-img'
                                    onLoad={e => handleImageLoad(e.target)}
                                />
                            </ReactCrop>
                        </div>

                        {previewUrl && (
                            <div className="preview-container">
                                <h4>Preview:</h4>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className='preview-img'
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default CropImage;