import React, { useState, useEffect, useLayoutEffect } from 'react';
import Samplerr from './Samplerr.jsx';
import { marbleImage, ordArrayImage, ordArrayAudio, coinUrl, colors } from 'https://ordinals.com/content/698e34cde2d7a61576f06b2716b62fe8b9b963e2e0a8beb0f5b46a24301c7aebi0';
 
function VinylRecord({ text, onClick }) {
  return (
    
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
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

       <circle cx="150" cy="150" r="145" fill="url(#vinylGradient)" />
 
      
       <defs>
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
          <feColorMatrix type="saturate" values="0" result="desaturatedNoise"/>
          <feBlend in="SourceGraphic" in2="desaturatedNoise" mode="multiply" result="blend"/>
        </filter>
        
     
        
        <pattern id="goldVeins" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="rgba(218,165,32,0.4)" strokeWidth="0.5"/>
          <path d="M0,25 Q25,75 50,25 T100,25" fill="none" stroke="rgba(218,165,32,0.3)" strokeWidth="0.5"/>
          <path d="M0,75 Q25,25 50,75 T100,75" fill="none" stroke="rgba(218,165,32,0.3)" strokeWidth="0.5"/>
        </pattern>
        
        <pattern id="marblePattern" patternUnits="userSpaceOnUse" width="300" height="300">
          <image href={marbleImage} width="300" height="300" />
        </pattern>
      </defs>

       <circle 
        cx="150" 
        cy="150" 
        r="140" 
        fill="url(#marblePattern)"
      />

       {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={120 - i * 12}
          fill="none"
          stroke="rgba(218,165,32,0.2)"
          strokeWidth="0.9"
        />
      ))}

       <circle cx="150" cy="150" r="40" fill="white" />
      <image
        href={coinUrl}
        x="100"
        y="100"
        width="100"
        height="100"
        clipPath="circle(60px at 45px 45px)"
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
  const [audioUrl, setAudioUrl] = useState(ordArrayAudio);
  const [imageUrl, setImageUrl] = useState(ordArrayImage);
  function checkCORS(url) {
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
            console.error('CORS check failed:', error);
        });
}

  useEffect(() => {
  
        if(!showVinylRecord) {
           setAudioUrl(ordArrayAudio);
          setImageUrl(ordArrayImage);
        }
 

     if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setShowSamplerrComponent(true);
      }, 150);  
      return () => clearTimeout(timer);
    }
    
    console.log('Component mounted');
    
  
  const url = "https://arweave.net/";
   checkCORS(url);
  
     return () => {
      console.log('Component will unmount');
      
    };
  }, [isFlipping]); 

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === true) {
    return (
      <div>
       <div
        style={{
          backgroundImage: `url(${showSamplerrComponent ? imageUrl : coinUrl})`,
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
          style={{
            background: `linear-gradient(45deg, ${gradientColors})`, 
             height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1, 
          }}
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
                    setAudioUrl( audioUrl );
                    setImageUrl( imageUrl );
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
              audioUrl={audioUrl}
              imageUrl={imageUrl}
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
        src={iomApp}
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