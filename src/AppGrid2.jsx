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
  
      if (!showVinylRecord) {
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
        if (url === 'localhost') {
          setCorsSuccess(true);
          console.log('CORS success (localhost)');
        } else if (url === 'https://arweave.net/') {
          setCorsSuccess(false);
          console.log('CORS failure (arweave.net)');
        } else {
          fetch(url)
            .then((response) => {
              if (response.ok) {
                setCorsSuccess(true);
                console.log('CORS success');
              } else {
                setCorsSuccess(false);
                console.log('CORS failure');
              }
            })
            .catch((error) => {
              setCorsSuccess(false);
              console.log('CORS failure (error)', error);
            });
        }
      }
  
      const url = 'https://arweave.net/'; // or "localhost"
      const local = 'localhost';
      checkCORS(local);
  
      return () => {
        console.log('Component will unmount');
      };
    }, [isFlipping]);
  
    if (corsSuccess === null) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        {/* Blurred Background */}
        <div
          style={{
            backgroundImage: `url(${"https://ordinals.com/content/b86c4701d220a90d3cd510b8f06143654ca0d18ee644f61c37ae910c44308f71i0"})`,
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
    );
  }