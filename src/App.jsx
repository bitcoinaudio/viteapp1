// App.jsx
import React, { useState, useEffect } from 'react';
import Samplerr, { ordArray } from './Samplerr.jsx'; // Import Samplerr component


var url = window.location.pathname;
var urlarray = url.split("/");
// var ins_id = urlarray[urlarray.length - 1];
var ins_id = "4e36c60daf4a9dc31c7b4527d31b3191e1ab3cf52ba4fdff866b6e68e335f94di0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6));

function VinylRecord({ text, onClick }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Vinyl disc with gradient */}
      <defs>
        <linearGradient id="vinylGradient" gradientTransform="rotate(45)">
          {colors.map((color, idx) => (
            <stop
              key={idx}
              offset={`${(idx * 100) / (colors.length - 1)}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>

      {/* Main vinyl disc */}
      <circle cx="150" cy="150" r="145" fill="url(#vinylGradient)" />
      <circle cx="150" cy="150" r="140" fill="black" opacity="0.8" />

      {/* Grooves */}
      {[...Array(9)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={120 - i * 15}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Center label */}
      <circle cx="150" cy="150" r="45" fill="white" />
      <text
        x="150"
        y="150"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10px"
        fontFamily="Arial"
      >
        {text}
      </text>
    </svg>
  );
}

const ColorGrid = ({ isLarge, onClick }) => {
  const gridSize = isLarge ? '60vh' : '20vh';
  const svgSize = isLarge ? 300 : 100;
  const rectSize = svgSize / 3;
  const expectedLength = 64;

  if (id.length !== expectedLength) {
    console.error('ins_id has unexpected length');
    return null;
  }

  const localChunks = [];
  const chunkSize = 7;
  let index = 0;
  for (let i = 0; i < 8; i++) {
    localChunks.push(id.slice(index, index + chunkSize));
    index += chunkSize;
  }
  localChunks.push(id.slice(index));

  const localColors = localChunks.map(chunk => '#' + chunk.slice(0, 6));

  return (
    <div
      onClick={onClick}
      style={{
        position: isLarge ? 'fixed' : 'absolute',
        bottom: isLarge ? '50%' : '20px',
        right: isLarge ? '50%' : '20px',
        transform: isLarge ? 'translate(50%, 50%)' : 'none',
        width: gridSize,
        height: gridSize,
        gap: '1px',
        background: '#333',
        padding: '1px',
        cursor: 'pointer',
        zIndex: isLarge ? 10 : 1,
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {localColors.map((color, idx) => {
          const x = (idx % 3) * rectSize;
          const y = Math.floor(idx / 3) * rectSize;
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={rectSize}
              height={rectSize}
              fill={color}
              stroke="black"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function App() {
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

  useEffect(() => {
    // Save the new loadCount to localStorage
    localStorage.setItem('loadCount', loadCount.toString());

    // Check if we should show the sampler thumbnail every 5th load
    if (loadCount % 5 === 0) {
      setShowSamplerrThumbnail(true);
      const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];
      setAudioUrl(randomOrd.audio);
      setImageUrl(randomOrd.image);
    }

    // Check CORS (you can adjust this logic as needed)
    function checkCORS(url) {
      if (url === 'localhost') {
        setCorsSuccess(true);
        console.log('CORS success (localhost)');
      } else if (url === 'https://arweave.net/') {
        setCorsSuccess(false);
        console.log('CORS failure (arweave.net)');
      } else {
        // For any other URL, perform the actual CORS check
        fetch(url)
          .then(response => {
            if (response.ok) {
              setCorsSuccess(true);
              console.log('CORS success');
            } else {
              setCorsSuccess(false);
              console.log('CORS failure');
            }
          })
          .catch(error => {
            setCorsSuccess(false);
            console.log('CORS failure (error)', error);
          });
      }
    }

    const local = 'localhost';
    checkCORS(local);

    return () => {
      console.log('Component will unmount');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (corsSuccess === null) {
    return <div>Loading...</div>;
  }

  if (corsSuccess === false) {
    return <div>CORS failure</div>;
  } else {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'relative',
          backgroundColor: '#1a1a1a', // Optional: added dark background to make vinyl pop
        }}
      >
        {!showSamplerrComponent ? (
          <>
            <VinylRecord
              text={text}
              onClick={() => {
                const newClickCount = clickCount + 1;
                setClickCount(newClickCount);
                localStorage.setItem('clickCount', newClickCount.toString());

                if (showSamplerrThumbnail) {
                  // Do nothing on vinyl click when thumbnail is displayed
                } else {
                  if (newClickCount % 5 === 0) {
                    // Every 5th click, show the sampler thumbnail
                    setShowSamplerrThumbnail(true);
                    const randomOrd =
                      ordArray[Math.floor(Math.random() * ordArray.length)];
                    setAudioUrl(randomOrd.audio);
                    setImageUrl(randomOrd.image);
                  } else {
                    // Show large color grid
                    setShowColorGrid(true);
                  }
                }
              }}
            />
            {showSamplerrThumbnail ? (
              <img
                src={imageUrl}
                alt="Samplerr Thumbnail"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  width: '150px',
                  height: '200px',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
                onClick={() => {
                  // When thumbnail is clicked, show the Samplerr component in place of the vinyl
                  setShowSamplerrComponent(true);
                }}
              />
            ) : (
              <>
                {showColorGrid && (
                  <ColorGrid
                    isLarge={true}
                    onClick={() => setShowColorGrid(false)}
                  />
                )}
                {!showColorGrid && (
                  <ColorGrid
                    isLarge={false}
                    onClick={() => setShowColorGrid(true)}
                  />
                )}
              </>
            )}
          </>
        ) : (
          // Show Samplerr component in place of the vinyl
          <Samplerr
            audioUrl={audioUrl}
            imageUrl={imageUrl}
            onBack={() => {
              setShowSamplerrComponent(false);
              // Optionally reset the thumbnail
              // setShowSamplerrThumbnail(false);
            }}
          />
        )}
      </div>
    );
  }
}
