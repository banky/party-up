import React, { useState } from "react";
import styled from "styled-components";
import { useMusic } from "lib/music/hook";
import { Song } from "lib/music/types";
import { SongCard } from "components/song-card/song-card.component";
import searchIcon from "./images/search-icon.png";
import cancelIcon from "./images/cancel-icon.png";

const SearchContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: scroll;
`;

const SongQueue = styled.ul`
  padding: 0;
  margin: 0 auto;
  max-width: 700px;
`;

const SongQueueItem = styled.ul`
  list-style-type: none;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  border: 1px solid #ebcfb2;
  border-radius: 20px;
  width: 40%;
  height: 2em;
  font-size: 22px;
  font-family: "Muli";
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  height: 48px;
  width: 48px;
  margin-left: 10px;
  border: none;
  border-radius: 10px;
  margin-top: 20px;
  &:hover {
    background-color: #a0a0a0;
  }
`;

const ButtonIcon = styled.img`
  width: 25px;
`;

type SearchProps = {
  userIsDj: boolean;
  cancelSearch: VoidFunction;
  onSelectSong: (song: Song) => void;
};

export const Search = ({
  userIsDj,
  cancelSearch,
  onSelectSong,
}: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const music = useMusic();

  return (
    <SearchContainer>
      <div>
        <SearchInput
          placeholder="Search for a song! "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <StyledButton
          type="submit"
          aria-label="search-button"
          onClick={() => {
            if (!searchInput.trim().length) return;
            music
              .search(searchInput, ["track"])
              .then((searchResults) => setSearchResults(searchResults));
          }}
        >
          <ButtonIcon src={searchIcon} alt="" />
        </StyledButton>
        <StyledButton aria-label="cancel-search-button" onClick={cancelSearch}>
          <ButtonIcon src={cancelIcon} alt="" />
        </StyledButton>
      </div>
      <SongQueue>
        {searchResults.map((song) => {
          return (
            <SongQueueItem key={song.url}>
              <SongCard
                song={song}
                actionIcon="plus"
                actionDisabled={!userIsDj}
                onClickActionIcon={() => onSelectSong(song)}
              />
            </SongQueueItem>
          );
        })}
      </SongQueue>
    </SearchContainer>
  );
};
