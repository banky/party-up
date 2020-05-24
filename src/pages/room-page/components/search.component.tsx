import React, { useState } from "react";
import "./search.css";
import { useMusic } from "../../../lib/music-interface/hook";
import { Song } from "../../../lib/constants";
import { SongCard } from "../../../components/song-card/song-card.component";

type SearchProps = {
  cancelSearch: VoidFunction;
  onSelectSong: (song: Song) => void;
};

export const Search = ({ cancelSearch, onSelectSong }: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const music = useMusic();

  return (
    <div className="search-container">
      <input
        placeholder="Search for a song! "
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        onClick={() =>
          music
            .search(searchInput, ["track"])
            .then((searchResults) => setSearchResults(searchResults))
        }
      >
        Search
      </button>
      <button onClick={cancelSearch}>Cancel</button>
      <ul className="song-card">
        {searchResults.map((result) => {
          return (
            <SongCard
              song={result}
              actionIcon="plus"
              onClick={() => onSelectSong(result)}
            />
          );
        })}
      </ul>
    </div>
  );
};
