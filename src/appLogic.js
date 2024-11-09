// appLogic.js

import { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import Samplerr, { ordArray } from './Samplerr.jsx';

export const coinUrls = [
  'https://ordinals.com/content/0e113d456b01a5d008c7f0da74eef02ea9a7315d74a6ba6299425d47036909bdi0',
  'https://ordinals.com/content/bf7561a8d27133a3e1144ac49ae1c24ac263f4271d5cf07f151740b3f3c3c54ci0',
  'https://ordinals.com/content/9d05e297b0e32bd4c955914c03c406eb98635fd805a7c01340f89660aea69ad4i0',
  'https://ordinals.com/content/503b48a1b7c209c88467fb76773ee3d6215a2a32d3771a9479d76034d315c9eei0',
  'https://ordinals.com/content/5fab883761387f948b62fcd7e2c58fae14fc22338783d641d489154fa3de4d9fi0',
  'https://ordinals.com/content/9aea7d959fbd9bba7747294a0f8f8be1ec291380b9460e6a48c181f8e587fd91i0'
];

export const coinStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  height: '600px',
  cursor: 'pointer',
  zIndex: 1,
  transition: 'transform 0.15s ease-in-out',
  transformStyle: 'preserve-3d',
};

export function useAppLogic() {
  const [isFlipping, setIsFlipping] = useState(false);
  const gltf = useLoader(GLTFLoader, 'https://radinals.bitcoinaudio.co/content/8df042b2d8fd7f9e089072c266645567cebb9a7723ae0154902b2fd1239fc74bi0');
  const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerrThumbnail, setShowSamplerrThumbnail] = useState(false);
  const [showSamplerrComponent, setShowSamplerrComponent] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [loadCount, setLoadCount] = useState(
    parseInt(localStorage.getItem('loadCount') || '0') + 1
  );
  const [clickCount, setClickCount] = useState(
    parseInt(localStorage.getItem('clickCount') || '0')
  );
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonImage, setButtonImage] = useState(() => {
    const random = Math.random() * 100;
    if (random < 40) return 'colorGrid';
    if (random < 75) return coinUrls[0];
    if (random < 80) return coinUrls[1];
    if (random < 85) return coinUrls[2];
    if (random < 92) return coinUrls[3];
    if (random < 98) return coinUrls[4];
    return coinUrls[5];
  });

  useEffect(() => {
    localStorage.setItem('loadCount', loadCount.toString());
    const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];
    setAudioUrl(randomOrd.audio);
    setImageUrl(randomOrd.image);

    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setShowSamplerrComponent(true);
      }, 150);
      return () => clearTimeout(timer);
    }

    function checkCORS(url) {
      if (url === "localhost") {
        setCorsSuccess(true);
      } else if (url === "https://arweave.net/") {
        setCorsSuccess(false);
      } else {
        fetch(url)
          .then(response => {
            if (response.ok) {
              setCorsSuccess(true);
            } else {
              setCorsSuccess(false);
            }
          })
          .catch(() => {
            setCorsSuccess(false);
          });
      }
    }

    const local = "localhost";
    checkCORS(local);

    return () => {
      console.log('Component will unmount');
    };
  }, [isFlipping]);

  return {
    isFlipping,
    setIsFlipping,
    gltf,
    text,
    corsSuccess,
    showSamplerrThumbnail,
    setShowSamplerrThumbnail,
    showSamplerrComponent,
    setShowSamplerrComponent,
    showColorGrid,
    setShowColorGrid,
    loadCount,
    clickCount,
    audioUrl,
    imageUrl,
    buttonImage
  };
}