import React, { useState } from "react";
import Cropper from "react-easy-crop";

const ImageCropper = ({ imageSrc, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    return (
        <div style={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}  // Aspek rasio 1:1
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
        </div>
    );
};

export default ImageCropper;
