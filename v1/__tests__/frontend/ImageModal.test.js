// ImageModal Component Tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageModal from '../../src/components/ImageModal';

describe('ImageModal Component', () => {
  const mockImage = {
    name: 'test-image.jpg',
    path: '/path/to/test-image.jpg',
    creationDate: '2023-01-01',
    modificationDate: '2023-01-02',
    format: 'jpg',
    GPS: { lat: 10, lng: 20 },
  };

  it('should render the ImageModal component', () => {
    render(<ImageModal image={mockImage} onClose={() => {}} />);
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('Name: test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('Path: /path/to/test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('GPS: 10, 20')).toBeInTheDocument();
  });
});