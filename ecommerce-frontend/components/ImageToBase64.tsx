import React, { useState } from 'react';

interface ImageToBase64Props {
  onBase64Change?: (base64: string) => void;
}

const ImageToBase64: React.FC<ImageToBase64Props> = ({ onBase64Change }) => {
  const [base64, setBase64] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      setBase64(result);
      if (onBase64Change) {
        onBase64Change(result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {base64 && (
        <div>
          <h3>Image Preview:</h3>
          <img src={base64} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          <h3>Base64 String:</h3>
          <textarea readOnly value={base64} rows={5} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageToBase64;
