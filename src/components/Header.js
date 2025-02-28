// src/components/Header.js
import React from "react";

const Header = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <header>
      <h1>Movie Trailer App</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for movies..."
      />
      <button onClick={handleSearch}>Search</button>
    </header>
  );
};

export default Header;
