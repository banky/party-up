import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Input } from "components/input/input.component";
import { useMusic } from "lib/music/hook";
import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";
import { SongCard } from "components/song-card/song-card.component";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import { RootState } from "store/reducers";
import { useParams } from "react-router-dom";
import { SongQueue, SongQueueItem } from "../song-queue";

const SEARCH_DEBOUNCE = 750; // Milliseconds

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const music = useMusic();
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const { roomKey } = useParams();

  const onSearch = useDebouncedCallback(
    () => {
      music
        .search(searchQuery, ["track"])
        .then((searchResults) => setSearchResults(searchResults));
    },
    [music, searchQuery],
    SEARCH_DEBOUNCE
  );

  useEffect(() => {
    onSearch();
  }, [searchQuery, onSearch]);

  const onPressSongCard = useCallback(
    (song: Song) => {
      firebase.database().ref(`rooms/${roomKey}/queues/${userId}`).push(song);
    },
    [firebase, roomKey, userId]
  );

  return (
    <>
      <StyledInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Start typing to search"
      />
      <SongQueue>
        {searchResults.map((song) => {
          return (
            <SongQueueItem key={song.url}>
              <SongCard
                song={song}
                actionIcon="plus"
                actionDisabled={false}
                onClickActionIcon={() => onPressSongCard(song)}
              />
            </SongQueueItem>
          );
        })}
      </SongQueue>
    </>
  );
};

const StyledInput = styled(Input)`
  margin-top: 20px;
`;
