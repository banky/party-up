import React from "react";
import "./song-card.css";

type SongCardProps = {
    songName: string,
    artists: string,
    imgUrl: string
};

export const SongCard = ({ songName, artists, imgUrl }: SongCardProps) => {
    return (
        <div
            className="song-item"
        >
            <img
                className="song-image"
                src={imgUrl}>
            </img>
            <div className="song-info-wrapper">
                <span className="song-text">{songName}</span><br />
                <span className="song-text">{artists}</span>
            </div>
        </div>
    );
};