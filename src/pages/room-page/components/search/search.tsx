import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Input } from "components/input/input.component";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { useMusic } from "lib/music/hook";
import { Song } from "lib/music/types";
import { SongCard } from "components/song-card/song-card.component";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const music = useMusic();

  const onSearch = useCallback(() => {
    music.search(searchQuery, ["track"]).then((searchResults) => {
      setSearchResults(searchResults);
    });
  }, [music, searchQuery]);

  return (
    <>
      <StyledInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <PrimaryButton onClick={() => onSearch()}>Search</PrimaryButton>
      <SongQueue>
        {searchResults.map((song) => {
          return (
            <SongQueueItem key={song.url}>
              <SongCard
                song={song}
                actionIcon="plus"
                actionDisabled={false}
                onClickActionIcon={() => {}}
              />
            </SongQueueItem>
          );
        })}
      </SongQueue>
    </>
  );
};

const SongQueue = styled.ul`
  padding: 0;
  margin: auto;
  margin-bottom: 20px;
  max-width: 700px;
  list-style-type: none;
`;

const SongQueueItem = styled.li`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledInput = styled(Input)`
  margin-top: 20px;
`;
