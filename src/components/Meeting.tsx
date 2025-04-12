
import { useParams } from 'react-router-dom';
import { HMSPrebuilt } from '@100mslive/roomkit-react';

const MeetingPage = () => {
  const { roomCode } = useParams();

  return (
    <div style={{ height: '100vh' }}>
      <HMSPrebuilt roomCode={roomCode} />
    </div>
  );
};

export default MeetingPage;
