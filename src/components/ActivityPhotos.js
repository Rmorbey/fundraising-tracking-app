import React, { useState, memo } from 'react';
import LazyImage from './LazyImage';

const ActivityPhotos = memo(function ActivityPhotos({ photos }) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPhoto(null);
  };

  if (!photos || (photos.photos || photos).length === 0) {
    return null;
  }

  return (
    <>
      {/* Photos Section - Display photos directly without container */}
      {(photos.photos || photos).map((photo, index) => {
        // Use highest quality photo URL (size=5000) for all display sizes
        let photoUrl = null;
        if (photo.urls) {
          // Prefer high-quality URL, fallback to available sizes
          photoUrl = photo.urls['1200'] || photo.urls['600'] || photo.urls['300'];
        } else if (photo.url) {
          photoUrl = photo.url;
        } else if (typeof photo === 'string') {
          photoUrl = photo;
        }
        
        if (!photoUrl) {
          console.warn('No valid photo URL found for photo:', photo);
          return null;
        }
        
        return (
          <LazyImage
            key={index}
            src={photoUrl}
            alt={`Activity ${index + 1}`}
            onClick={() => {
              setSelectedPhoto(photoUrl);
              setShowPhotoModal(true);
            }}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              cursor: 'pointer',
              borderRadius: '8px',
              marginBottom: '12px'
            }}
          />
        );
      })}

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={closePhotoModal}>×</button>
            <img 
              src={
                selectedPhoto.urls?.['1200'] || 
                selectedPhoto.urls?.['600'] || 
                selectedPhoto.urls?.['300'] ||
                selectedPhoto.url || 
                selectedPhoto
              } 
              alt="Full size view"
            />
          </div>
        </div>
      )}
    </>
  );
});

export default ActivityPhotos;
