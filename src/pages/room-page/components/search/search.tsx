import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Input } from "components/input/input.component";
import { useMusic } from "lib/music/hook";
import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";
import { MediaCard } from "components/media-card/media-card.component";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import { RootState } from "store/reducers";
import { useParams } from "react-router-dom";
import { MediaQueue, MediaQueueItem } from "../../../../components/media-queue";

const SEARCH_DEBOUNCE = 750; // Milliseconds

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const music = useMusic();
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const { roomKey } = useParams<{ roomKey: string }>();

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

  const onClickAddSong = useCallback(
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
      <MediaQueue>
        {searchResults.map((song) => {
          return (
            <MediaQueueItem key={song.url}>
              <MediaCard
                title={song.name}
                subtitle={song.artist}
                imageUrl={song.smallImage}
                imageAlt={`${song.name} album art`}
                actionIcon="plus"
                actionDisabled={false}
                onClickActionIcon={() => onClickAddSong(song)}
              />
            </MediaQueueItem>
          );
        })}
      </MediaQueue>
    </>
  );
};

const StyledInput = styled(Input)`
  margin-top: 20px;
`;
