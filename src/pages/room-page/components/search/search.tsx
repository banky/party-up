import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Input } from "components/input/input.component";
import { useMusic } from "lib/music/hook";
import { Song } from "lib/music/types";
import { MediaCard } from "components/media-card/media-card.component";
import { useDebouncedCallback } from "hooks/use-debounced-callback";
import { MediaQueue, MediaQueueItem } from "components/media-queue";
import { useEnqueueSongFirebase } from "hooks/use-enqueue-song-firebase";
import { LoadingSpinner } from "components/loading-spinner/loading-spinner";

const SEARCH_DEBOUNCE = 750; // Milliseconds

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const music = useMusic();
  const enqueueSongFirebase = useEnqueueSongFirebase();

  const onSearch = useDebouncedCallback(
    () => {
      music.search(searchQuery, ["track"]).then((searchResults) => {
        setQueryLoading(false);
        setSearchResults(searchResults);
      });
      setQueryLoading(true);
    },
    [music, searchQuery],
    SEARCH_DEBOUNCE
  );

  useEffect(() => {
    return onSearch();
  }, [searchQuery, onSearch]);

  const onClickAddSong = useCallback(
    (song: Song) => {
      enqueueSongFirebase(song);
    },
    [enqueueSongFirebase]
  );

  return (
    <>
      <StyledInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Start typing to search"
      />
      <MediaQueue>
        {queryLoading ? (
          <LoadingSpinner />
        ) : (
          searchResults.map((song) => {
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
          })
        )}
      </MediaQueue>
    </>
  );
};

const StyledInput = styled(Input)`
  margin-top: 20px;
`;
