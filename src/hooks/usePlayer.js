import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

export default function usePlayer(song, autoplay = false, setAutoplay) {
  const currentSong = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationID = useRef(null);

  useEffect(() => {
    if (song) {
      const sound = (currentSong.current = new Howl({
        src: song.file,
        html5: true,
        autoplay,
        onload() {
          setDuration(Math.round(sound.duration()));
        },
        onplay() {
          setPlaying(true);
          setAutoplay(true);
        },
        onpause() {
          setAutoplay(false);
          setPlaying(false);
        },
        onseek() {},
        onend() {
          setPlaying(false);
          setTimer(0);
        },
        onstop() {
          setAutoplay(false);
          setPlaying(false);
          setTimer(0);
        }
      }));
    }

    return () => {
      if (currentSong.current) {
        currentSong.current.stop();
        currentSong.current.unload();
        currentSong.current = null;
      }
    };
  }, [song]);

  function step() {
    const sound = currentSong.current;
    const seek = Math.round(sound.seek());
    if (Number.isNaN(seek)) {
      return;
    }

    setTimer(seek);

    animationID.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    if (playing) {
      animationID.current = requestAnimationFrame(step);
    }

    return () => {
      if (animationID.current) {
        cancelAnimationFrame(animationID.current);
        animationID.current = null;
      }
    };
  }, [playing]);

  function play() {
    const sound = currentSong.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause(sound._sounds[0]._id);
      return;
    }

    sound.play();
  }

  function seek(per) {
    const sound = currentSong.current;
    if (!sound || sound.state() === 'unloaded') return;

    setTimer(Math.round(duration * per));

    if (sound.playing(sound._sounds[0]._id)) {
      sound.pause(sound._sounds[0]._id);
      sound.seek(duration * per);
      console.log('after seek:', sound.play(sound._sounds[0]._id));
    } else {
      sound.seek(duration * per);
    }
  }

  return { play, playing, timer, duration, seek };
}
