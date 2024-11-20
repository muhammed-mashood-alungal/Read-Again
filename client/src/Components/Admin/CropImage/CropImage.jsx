import React, { useEffect, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropImage.css'

const CropImage = ({ isOpen, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        // Cleanup function for URLs
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

   // if (!isOpen) return null;

    const generateCroppedImage = (crop, imgRef) => {
        if (!crop || !imgRef.current) return null;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

        const pixelCrop = {
            x: crop.x * scaleX,
            y: crop.y * scaleY,
            width: crop.width * scaleX,
            height: crop.height * scaleY,
        };

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            imgRef.current,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas;
    };

    const handleImageLoad = (image) => {
        imgRef.current = image;
        return false;
    };

    const handlePreviewClick = () => {
        if (!completedCrop) return;

        const canvas = generateCroppedImage(completedCrop, imgRef);
        if (!canvas) return;

        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                
                // Cleanup old preview
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
        if (!completedCrop) return;

        const canvas = generateCroppedImage(completedCrop, imgRef);
        if (!canvas) return;

        canvas.toBlob(
            (blob) => {

                if (!blob) return;
                // Convert blob to File object to match your parent component's expectations
                const file = new File([blob], imageSrc.name, { type: imageSrc.type });
                onCropComplete(file);
            },
            'image/jpeg',
            1
        );
    };

    return (
        isOpen && (<div className="modal-overlay">
            <div className="">
                <h3>Crop Image</h3>
                <div className="react-crop-container">
                    <ReactCrop
                        crop={crop}
                        onChange={newCrop => setCrop(newCrop)}
                        onComplete={c => setCompletedCrop(c)}
                    >
                        <img
                            ref={imgRef}
                            src={URL.createObjectURL(imageSrc)}
                            alt="Crop me"
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
                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                    </div>
                )}

                <div className="button-container">
                    <button onClick={handlePreviewClick}>
                        Preview
                    </button>
                    <button onClick={handleSaveClick}>
                        Save
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ));
};

export default CropImage;