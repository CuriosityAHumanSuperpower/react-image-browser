// Home Page Component
import React, { useState, useEffect } from 'react';
import ImageModal from '../components/ImageModal';

const Home = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      // Simulate API call to fetch images
      const newImages = Array.from({ length: 10 }, (_, i) => ({
        id: i + (page - 1) * 10,
        name: `Image ${i + (page - 1) * 10}`,
        path: `/path/to/image${i + (page - 1) * 10}.jpg`,
      }));
      setImages([...images, ...newImages]);
      setLoading(false);
    };

    fetchImages();
  }, [page]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage(page + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page]);

  return (
    <div>
      <h1>Home</h1>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} onClick={() => handleImageClick(image)}>
            <img src={image.path} alt={image.name} loading="lazy" />
          </div>
        ))}
      </div>
      {loading && <p>Loading more images...</p>}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;