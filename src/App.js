import "./App.scss";
import GalleryView from "./components/GalleryView.js";
import DetailView from "./components/DetailsView.js"; 
import React, {useState, useEffect} from "react";  
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'; 
import axios from "axios";  
import PropTypes from 'prop-types';

function SearchBar({searchVal, setSearchVal, sortBy, setSortBy, orderBy, setOrderBy}) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <label htmlFor="sortBy">Sort by: </label>
      <select
        id="sortBy"
        value={sortBy}
        onChange= {(e) => setSortBy(e.target.value)}
      >
        <option value="Title">Title</option>
        <option value="year">Year</option>
      </select>
      <label htmlFor="orderBy">Order: </label>
      <select
        id="orderBy"
        value={orderBy}
        onChange={(e) => setOrderBy(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
  );
}

SearchBar.propTypes = {
  searchVal: PropTypes.string.isRequired,
  setSearchVal: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
  setOrderBy: PropTypes.func.isRequired,
};

const ArtworkDetails = ({artwork, onArtworkClick}) => {
  console.log("Artwork Details:", artwork)
  // const handleArtworkClick = () => {
  //   onArtworkClick(artwork);
  // };
  return (
    <div className="list-view">
      <Link to={`/details/${artwork.id}`}>
        <img
          src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
          alt="A beautiful landscape"
        />
        <h3>{artwork.title}, {artwork.artist_title}</h3>
        <p>{artwork.date_display}</p>
      </Link>
    </div>
  );
};

ArtworkDetails.propTypes = {
  artwork: PropTypes.object.isRequired,
  onArtworkClick: PropTypes.func.isRequired,
};

export default function App() {
  const [data, setData] = useState([]);
  //const [filteredData, setFilteredData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [orderBy, setOrderBy] = useState("asc");
  const [listView, setListView] = useState(true);
  //const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  // const [selectedArtwork, setSelectedArtwork] = useState(null);

  // const handleArtworkClick = (artwork) => {
  //   setSelectedArtwork(artwork);
  //   setIsDetailViewOpen(true);
  // };  
  const toggleView = () => {
    setSearchVal("");
    setListView(!listView);
  };

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `https://api.artic.edu/api/v1/artworks/search?q=${searchVal}&query[term][is_public_domain]=true&limit=100&fields=id,image_id,title,artist_title,date_display,medium_display`; // limit is 100 according to documentation
      try {
        const response = await axios.get(endpoint);
        const data = response.data.data;
        const sortedData = [...data].sort((a, b) => {
          if (sortBy === "title") {
            return a.title.localeCompare(b.title) * (orderBy === "asc" ? 1 : -1);
          } else   {
            return a.date_display.localeCompare(b.date_display) * (orderBy === "asc" ? 1 : -1);
          }
        });
        setData(sortedData);
        //setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchVal, sortBy, orderBy, listView]);
  
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="page">
      <h1>Art Institute of Chicago Artworks</h1>
      <h4>View Artworks in List or Gallery! Click on the Artworks to Learn More</h4>
        <div className="view-toggle">
          <button onClick={toggleView}>
            {listView ? "Switch to Gallery View" : "Switch to List View"}
          </button>
        </div>
        <Routes>
        <Route 
        path="/details/:artworkId" 
        element={<DetailView data={data} />} />
          <Route 
          path="/" 
          element={
              listView ? (
                <div className="search">
                  <h4> Search by Title or Year </h4>
                  <SearchBar searchVal={searchVal} setSearchVal={setSearchVal} setSortBy={setSortBy} setOrderBy={setOrderBy}
                  />
                    {data.map((artwork) => (
                      <ArtworkDetails artwork={artwork} // onArtworkClick={() => handleArtworkClick(artwork)}
                      />
                    ))}
                </div>
              ) : (
                <GalleryView data={data}  /> //onArtworkClick={handleArtworkClick}
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
