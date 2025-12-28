// ImageModal Component
import React from 'react';

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="image-modal">
      <button onClick={onClose}>Close</button>
      <img src={image.path} alt={image.name} />
      <div className="metadata-panel">
        <h3>Metadata</h3>
        <p>Name: {image.name}</p>
        <p>Path: {image.path}</p>
        <p>Creation Date: {image.creationDate}</p>
        <p>Modification Date: {image.modificationDate}</p>
        <p>Format: {image.format}</p>
        {image.GPS && (
          <div>
            <p>GPS: {image.GPS.lat}, {image.GPS.lng}</p>
            <button>View on Map</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;