import React, { useState, useEffect, useLayoutEffect } from 'react';
import Samplerr, { ordArray } from './Samplerr.jsx';
let coin1 = 'https://ordinals.com/content/0e113d456b01a5d008c7f0da74eef02ea9a7315d74a6ba6299425d47036909bdi0';
let coin2 = 'https://ordinals.com/content/bf7561a8d27133a3e1144ac49ae1c24ac263f4271d5cf07f151740b3f3c3c54ci0';
let coin3 = 'https://ordinals.com/content/9d05e297b0e32bd4c955914c03c406eb98635fd805a7c01340f89660aea69ad4i0';
let coin4 = 'https://ordinals.com/content/503b48a1b7c209c88467fb76773ee3d6215a2a32d3771a9479d76034d315c9eei0';
let coin5 = 'https://ordinals.com/content/5fab883761387f948b62fcd7e2c58fae14fc22338783d641d489154fa3de4d9fi0';
let coin6 = 'https://ordinals.com/content/9aea7d959fbd9bba7747294a0f8f8be1ec291380b9460e6a48c181f8e587fd91i0';

const coinStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  height: '600px',
  cursor: 'pointer',
  zIndex: 1,
  transition: 'transform 0.15s ease-in-out',
  transformStyle: 'preserve-3d',
};

var url = window.location.pathname;
var urlarray = url.split("/");
var ins_id = urlarray[urlarray.length - 1];
//var ins_id = "4e36c60daf4a9dc31c7b4527d31b3191e1ab3cf52ba4fdff866b6e68e335f94di0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6) + "a0");
 
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
      <image
        href={"https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0"}
        x="105"
        y="105"
        width="100"
        height="100"
        clipPath="circle(40px at 45px 45px)"
      />
      {/* <text
        x="150"
        y="150"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10px"
        fontFamily="Arial"
      >
        {text}
      </text> */}
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
const gradientColors = colors.join(', ');
export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);
   const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerrThumbnail, setShowSamplerrThumbnail] = useState(false);
  const [showSamplerrComponent, setShowSamplerrComponent] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [showVinylRecord, setShowVinylRecord] = useState(false);  
  const [loadCount, setLoadCount] = useState(
    parseInt(localStorage.getItem('loadCount') || '0') + 1
  );
  const [clickCount, setClickCount] = useState(
    parseInt(localStorage.getItem('clickCount') || '0')
  );
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonImage, setButtonImage] = useState(() => {
  const random = Math.random() * 100; // Generate number between 0-21
   
    if (random < 80) return 'colorGrid';
    if (random < 70) return coin1;
    if (random < 80) return coin2;
    if (random < 80) return coin3;
    if (random < 94) return coin4;
    if (random < 98) return coin5;
    return coin6;
  });

  useEffect(() => {
    localStorage.setItem('loadCount', loadCount.toString());
 
        // setShowSamplerrThumbnail(true);
        if(!showVinylRecord) {
          const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];
          setAudioUrl(randomOrd.audio);
          setImageUrl(randomOrd.image);
        }
 

     if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setShowSamplerrComponent(true);
      }, 150); // Match this duration with CSS transition
      return () => clearTimeout(timer);
    }
    
    console.log('Component mounted');
    
    function checkCORS(url) {
      if (url === "localhost") {
        setCorsSuccess(true);
        console.log("CORS success (localhost)");
      } else if (url === "https://arweave.net/") {
        setCorsSuccess(false);
        console.log("CORS failure (arweave.net)");
      } else {
        // For any other URL, perform the actual CORS check
        fetch(url)
          .then(response => {
            if (response.ok) {
              setCorsSuccess(true);
              console.log("CORS success");
            } else {
              setCorsSuccess(false);
              console.log("CORS failure");
            }
          })
          .catch(error => {
            setCorsSuccess(false);
            console.log("CORS failure (error)", error);
          });
      }
    }  
  
  const url = "https://arweave.net/"; // or "localhost"
  const local = "localhost";
  checkCORS(local);
  
    // If you need to clean up (analogous to componentWillUnmount), return a function:
    return () => {
      console.log('Component will unmount');
      
    };
  }, [isFlipping]); // The empty array means this effect runs once on mount and clean up on unmount

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === true) {
    return (
      <div>
      {/* Blurred Background */}
      <div
        style={{
          backgroundImage: `url("https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
       {/* Gradient Overlay */}
       <div
          style={{
            background: `linear-gradient(45deg, ${gradientColors})`, // Example gradient
            // opacity: 0.5, // Adjust opacity for desired effect
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1, // Positioned above the blurred background
          }}
        />

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {corsSuccess === true ? (
          !showSamplerrComponent ? (
            <>
              {buttonImage === 'colorGrid' ? (
                <VinylRecord
                  text={text}
                  onClick={() => {
                    setAudioUrl(
                      'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0'
                    );
                    setImageUrl(
                      'https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0'
                    );
                    setShowSamplerrComponent(true);
                    setShowVinylRecord(false);
                    setButtonImage(
                      'https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0'
                    );
                  }}
                  buttonImage={buttonImage}
                />
              ) : (
                <VinylRecord
                  text={text}
                  onClick={() => {
                    setAudioUrl(
                      'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0'
                    );
                    setImageUrl(
                      'https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0'
                    );
                    setShowSamplerrComponent(true);
                    setShowVinylRecord(false);
                    setButtonImage(
                      'https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0'
                    );
                  }}
                  buttonImage={buttonImage}
                />
              )}

              {showSamplerrThumbnail && (
                <img
                  src={imageUrl}
                  alt="Samplerr Thumbnail"
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    height: '300px',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  onClick={() => setShowSamplerrComponent(true)}
                />
              )}
            </>
          ) : (
            <Samplerr
              audioUrl={audioUrl}
              imageUrl={imageUrl}
              onBack={() => {
                setShowSamplerrComponent(false);
              }}
              buttonImage={buttonImage}
            />
          )
        ) : (
          <iframe
            src="https://arweave.net/ml05xf2_JpNGZNygviKlq1BCkvEkGMYhbA-AQEbSwoI"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              margin: 0,
              padding: 0,
              overflow: 'hidden',
            }}
            title="Fullscreen Content"
          />
        )}
      </div>
    </div>
    )
  } else {
    return (
    <iframe 
        src="https://arweave.net/ml05xf2_JpNGZNygviKlq1BCkvEkGMYhbA-AQEbSwoI"
         style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
        title="Fullscreen Content"
      />    )
  }

}