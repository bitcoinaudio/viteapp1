import React from 'react';

const ColorGrid = ({ onSampleSelect }) => {
  return (
    <div className="color-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        padding: '20px',
      }}
    >
      {ordArray.map((item) => (
        <div
          key={item.id}
          className="grid-item hover:scale-105 transition-transform"
          onClick={() => onSampleSelect(item.audio, item.image)}
          style={{
            cursor: 'pointer',
            aspectRatio: '1',
            overflow: 'hidden',
            borderRadius: '8px',
          }}
        >
          <img 
            src={item.image} 
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div className="item-info"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '5px',
              fontSize: '0.8rem',
            }}
          >
            <div>{item.name}</div>
            <div>{item.alias}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorGrid;