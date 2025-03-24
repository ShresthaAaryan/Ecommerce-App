// components/Base64Image.tsx
import React from 'react';

interface Base64ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  base64String: string;
}

const Base64Image: React.FC<Base64ImageProps> = ({ base64String, ...imgProps }) => {
  const imageSrc = `data:image/png;base64,${base64String}`;
  return <img src={imageSrc} {...imgProps} />;
};

export default Base64Image;
