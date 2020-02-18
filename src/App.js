import React, { useRef, useState } from 'react';

import usePlayer from './hooks/usePlayer';

export default function App() {
  const playlist = useRef([
    {
      artist: 'Drake',
      title: 'Started From the Bottom',
      album: 'Nothing Was The Same',
      file: 'http://localhost:5050/Started From the Bottom.mp3',
      howl: null
    },
    {
      artist: 'Drake',
      title: 'Star67',
      album: "If You're reading this, it's too late",
      file: 'http://localhost:5050/Star67.mp3',
      howl: null
    },
    {
      artist: '6lack',
      title: 'Balenciaga Challenge',
      album: 'East Atlanta Love Letter',
      file: 'http://localhost:5050/Balenciaga Challenge.mp3',
      howl: null
    }
  ]);

  const [index, setIndex] = useState(0);
  const currentSong = playlist.current[index];
  const [autoplay, setAutoplay] = useState(false);

  const { play, playing, timer, duration, seek } = usePlayer(
    currentSong,
    autoplay,
    setAutoplay
  );

  function onSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (percentage < 0 || percentage > 1) {
      return;
    }

    seek(percentage);
  }

  function skip(direction) {
    let i = index;
    i += direction === 'next' ? 1 : -1;

    if (i >= playlist.current.length) {
      i = 0;
    }

    if (i < 0) {
      i = playlist.current.length - 1;
    }

    setIndex(i);
  }

  function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = secs - minutes * 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div id="app-container">
      <div id="app">
        <div id="song-details">
          <p className="title">{currentSong.title || '[Title]'}</p>
          <p className="album">
            {currentSong
              ? `${currentSong.artist} - ${currentSong.album}`
              : '[Artist] - [Album]'}
          </p>
        </div>

        <div id="controls">
          <button onClick={() => skip('prev')}>Prev</button>
          <button onClick={play}>{playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => skip('next')}>Next</button>
        </div>

        <div id="seek">
          <p className="time">{formatTime(timer)}</p>
          <div className="seek-bar" onClick={onSeek}>
            <div className="track"></div>
            <div
              className="progress"
              style={{ width: (timer / duration) * 100 + '%' }}
            ></div>
            <div
              className="slider-btn"
              style={{ left: 'calc(' + (timer / duration) * 100 + '% - 6px' }}
            ></div>
          </div>
          <p className="time">{formatTime(duration)}</p>
        </div>
      </div>
    </div>
  );
}
