import React, { useState, useEffect, useLayoutEffect } from 'react';
import Samplerr from './Samplerr.jsx';
import { ordArray, vinylLables } from './ordArray.js';

let randomLabel = vinylLables[Math.floor(Math.random() * vinylLables.length)];
let randomLabelUrl = randomLabel.url; 
 
var url = window.location.pathname;
var urlarray = url.split("/");
//  var ins_id = urlarray[urlarray.length - 1];
var ins_id = "4e36c60daf4a9dc31c7b4527d31b3191e1ab3cf52ba4fdff866b6e68e335f94di0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6) + "af");
const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];  
const coinUrl = randomOrd.coin; 
const ordImage = randomOrd.image;
 
function VinylRecord({ text, onClick }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Define marble texture with turbulence and displacement */}
      <defs>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
        </filter>
        
        {/* <radialGradient id="marbleGradient">
          {colors.map((color, idx) => (
            <stop
              key={idx}
              offset={`${(idx * 100) / (colors.length - 1)}%`}
              stopColor={color}
              stopOpacity="0.8"
            />
          ))}
        </radialGradient> */}
         <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
          <feOffset in="blur" dx="4" dy="4" result="offsetBlur"/>
          <feFlood floodColor="rgba(0,0,0,0.3)" result="shadowColor"/>
          <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadowBlur"/>
          <feMerge>
            <feMergeNode in="shadowBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="marbleTexture">
          <feTurbulence type="turbulence" baseFrequency="0.2" numOctaves="7" seed="5" result="turb"/>
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="10"/>
        </filter>
      </defs>

      {/* Main marble disc */}
      <circle
        cx="150"
        cy="150"
        r="140"
        fill="url(#marbleGradient)"

      />
            <circle cx="150" cy="150" r="140" fill="#f5f5f5" opacity="0.6" />

  {/* Colored veins */}
  {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={140 - i * 15}
          fill="none"
          stroke="url(#veinGradient)"
          strokeWidth="1.5"
          strokeOpacity="1"
          filter="url(#noise)"
        />
      ))}
      {/* Subtle veins */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={140 - i * 11}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
          filter="url(#noise)"
        />
      ))}

      {/* Center label */}
      <circle cx="150" cy="150" r="45" fill="white" />
      <image
        href={coinUrl}
        x="100"
        y="100"
        width="105"
        height="105"
        clipPath="circle(50px at 50px 50px)"
      />
    </svg>
  );
}

const gradientColors = colors.join(', ');
export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerrThumbnail, setShowSamplerrThumbnail] = useState(false);
  const [showSamplerrComponent, setShowSamplerrComponent] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [showVinylRecord, setShowVinylRecord] = useState(false);  
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
 

  useEffect(() => {
  
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
        console.log("CORS success");
      } else if (url === "https://arweave.net/") {
        setCorsSuccess(false);
        console.log("CORS failure");
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
   checkCORS("localhost");
  
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
       <div
        style={{
          backgroundImage: `url(${coinUrl})`,
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
        <div
          // style={{
          //   background: `linear-gradient(45deg, ${gradientColors})`, // Example gradient
          //   opacity: 0.5, // Adjust opacity for desired effect
          //   height: '100vh',
          //   width: '100vw',
          //   position: 'fixed',
          //   top: 0,
          //   left: 0,
          //   zIndex: -1, // Positioned above the blurred background
          // }}
        />

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
          {!showSamplerrComponent ? (
            <> 
                <VinylRecord
                  text={text}
                  onClick={() => {
                    setAudioUrl(
                      'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0'
                    );
                    setImageUrl(
                      coinUrl
                    );
                    setShowSamplerrComponent(true);
                    setShowVinylRecord(false);
                    
                  }}
                 />
              

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
              audioUrl={randomOrd.audio}
              imageUrl={randomOrd.image}
              onBack={() => {
                setShowSamplerrComponent(false);
              }}
              
            />
          )}
        
      </div>
    </div>
    );
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
      />   
     )
  };

}