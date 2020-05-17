import React, {useEffect, useState} from 'react';
import "./VideoPlayer.scss";
import {BigPlayButton, ControlBar, Player} from 'video-react';

interface VideoPlayerProps {
  id: string;
  src: string;
  setVideoPlayer?(state:object): void
  setVideoPlayed?(played:boolean): void
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({ id,src, setVideoPlayer, setVideoPlayed}) => {

  const [player , setPlayer] = useState();
  const handleStateChange = (state:any) => {
    if (state.ended || (state.currentTime > 0 && state.duration > 0 && (state.currentTime / state.duration) > 0.8)) {
      if (setVideoPlayed) {
        setVideoPlayed(true);
      }
    }
  };
  useEffect(() => {
    if (player) {
      player.subscribeToStateChange(handleStateChange);
      if (setVideoPlayer) {
        setVideoPlayer(player);
      }
    } // eslint-disable-next-line
  }, [player, setVideoPlayer]);

  return (
    <Player id={id} ref={(self:any) => { setPlayer(self) }} playsInline={true} fluid={true} crossOrigin='anonymous'>
      <source src={src} />
      <BigPlayButton position="center" />
      <ControlBar autoHide={false} />
    </Player>
  );
};

export default VideoPlayer;
