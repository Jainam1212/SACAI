import { useParams } from 'react-router-dom';
import VideoRoom from '../components/VideoRoom';
import LiveChat from '../components/LiveChat';

const Room = () => {
  const { roomId } = useParams();

  return (
    <div className='w-full flex flex-row'>
      <div>
        <h2>Room: {roomId}</h2>
        <VideoRoom roomId={roomId as string} />
      </div>
      <div className="chat-container">
        <LiveChat />
      </div>
    </div>
  );
};

export default Room;
