import React, {useEffect, useState} from 'react';
import "./VideoPlayer.scss";
import { Player, BigPlayButton, ControlBar } from 'video-react';

interface VideoPlayerProps {
  id: string;
  src: string;
  setVideoState?(state:object): void
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({ id,src, setVideoState}) => {

  const [player , setPlayer] = useState();
  const handleStateChange = (state:object) => {
    if (setVideoState) {
      setVideoState(state);
    }
  };
  useEffect(() => {
    if (player) {
      player.subscribeToStateChange(handleStateChange);
    }
  }, [player]);

  return (
    <Player id={id} ref={(self:any) => { setPlayer(self) }} playsInline={true} fluid={true} crossOrigin='anonymous'>
      <source src={src} />
      <BigPlayButton position="center" />
      <ControlBar autoHide={false} />
    </Player>
  );
};

export default VideoPlayer;
