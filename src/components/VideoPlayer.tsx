import React, {useEffect, useState} from 'react';
import "./VideoPlayer.scss";
import { Player, ControlBar } from 'video-react';

interface VideoPlayerProps {
  id: string;
  src: string;
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({ id,src}) => {

  const [player , setPlayer] = useState();
  const handleStateChange = (state:any) => {
    console.log(state);
  };
  useEffect(() => {
    if (player) {
      player.subscribeToStateChange(handleStateChange);
    }
  }, [player]);

  return (
    <Player id={id} ref={(self:any) => { setPlayer(self) }} playsInline={true} fluid={true}>
      <source src={src} />
      <ControlBar autoHide={false} />
    </Player>
  );
};

export default VideoPlayer;
