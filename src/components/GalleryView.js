import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const GalleryView = ({data, onArtworkClick}) => {
  const [selectedMedium, setSelectedMedium] = useState('All Mediums');
  const [filteredData, setFilteredData] = useState([...data]);

  const mediumCounts = data.reduce((counts, artwork) => {
    const medium = artwork.medium_display || 'Unknown Medium';
    counts[medium] = (counts[medium] || 0) + 1;
    return counts;
  }, {});

  const filteredMediums = Object.keys(mediumCounts).filter(
    (medium) => mediumCounts[medium] >= 2
  );

  const mediumButtons = [...filteredMediums, 'All Mediums'];

  useEffect(() => {
    if (selectedMedium === 'All Mediums') {
      setFilteredData([...data]);
    } else {
      const filtered = data.filter(
        (artwork) =>
          artwork.medium_display &&
          artwork.medium_display.toLowerCase() === selectedMedium.toLowerCase()
      );
      setFilteredData(filtered);
    }
    console.log('filteredData:', filteredData);
  }, [filteredData, selectedMedium, data]);

  return (
    <div className="gallery-view">
      <h4> Sort by Medium </h4>
      <div className="medium-buttons">
        {mediumButtons.map((medium, index) => (
          <button
            key={index}
            className={medium === selectedMedium ? 'active' : ''}
            onClick={() => setSelectedMedium(medium)}
          >
            {medium}
          </button>
        ))}
      </div>
      <div className="gallery-items">
        {filteredData.map((artwork) => (
          <div key={artwork.id} className="gallery-item">
            <Link to={`/details/${artwork.id}`}> {}
            <img
              src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
              alt={artwork.title}
              onClick={() =>{console.log('ArtworkID', artwork.id);
              onArtworkClick(artwork)}} 
            />
            
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
