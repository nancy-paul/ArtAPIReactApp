import React from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';

const DetailView = ({data}) => {
  const {artworkId} = useParams();
  const navigate = useNavigate();

  const currentIndex = data.findIndex((artwork) => artwork.id.toString() === artworkId);
  const goToPrevious = () => {
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : data.length - 1;
    navigate(`/details/${data[previousIndex].id}`);
  };
  const goToNext = () => {
    const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
    navigate(`/details/${data[nextIndex].id}`);
  };
  const artwork = data[currentIndex];
  if (!artwork) {
    return <div>Loading...</div>;
  }
  return (
    <div className="detail-view">
      <img
          src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
          alt="A beautiful landscape"
        />
      <h3>Title: {artwork.title}, Artist: {artwork.artist_title}</h3>
      <p>Date: {artwork.date_display}</p>
      <p>Medium: {artwork.medium_display}</p>
      <Link to="/">Back to View</Link>
      <br></br>
        <button className="navigation-buttons" onClick={goToPrevious}>Previous</button>
        <button className="navigation-buttons" onClick={goToNext}>Next</button>
    </div>
  );
};

export default DetailView;
