import { useState } from 'react';
import io from 'socket.io-client';
import DailyIframe from '@daily-co/daily-js';
import Header from './header';
import CardGrid from './CardGrid';
import LeftSide from './LeftSide';

const socket = io('https://random-video-call-room-server.vercel.app');
let callFrame;

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [isInCall, setIsInCall] = useState(false); // New state variable

  const createRoom = () => {
  // Get the saved API and key from the session storage
  console.log("create room clicked");
  const savedKey = sessionStorage.getItem('key');
  
  console.log('Saved key:', savedKey); // Log the saved key

  // Send a POST request to the server with the saved API and key
  fetch('https://random-video-call-room-server.vercel.app/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ apiKey: savedKey }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => setRoomId(data.roomId))
  .catch(error => console.error('Error:', error)); // Log any errors // Log any errors
};

  const joinRoom = () => {
    const savedApi = sessionStorage.getItem('api');
    console.log("savedApi",savedApi);
    fetch(`https://random-video-call-room-server.vercel.app/room/${roomId}/join`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          socket.emit('joinRoom', roomId);

          // Start a video call
          const videoContainer = document.getElementById('video-call-frame');
          callFrame = DailyIframe.createFrame(videoContainer);
          callFrame.join({ url: `https://${savedApi}/${roomId}` });
          setIsInCall(true); // Set isInCall to true when a user joins a call
        }
      });
  };

  const leaveRoom = () => {
    if (callFrame) {
      callFrame.leave();
      setIsInCall(false); // Set isInCall to false when a user leaves a call
    }
  };

  return (
    <div>
      <Header />
      <div className="grid gap-4 p-4">
        {isInCall && (
          <button 
            className="w-full p-2 bg-red-600 text-white dark:bg-red-600 dark:text-white rounded hover:bg-red-700 transition-colors duration-200" 
            onClick={leaveRoom}
          >
            Leave Room
          </button>
        )}    
        <button 
          className="w-full p-2 bg-gray-900 text-white dark:bg-gray-900 dark:text-white rounded hover:bg-gray-800 transition-colors duration-200" 
          onClick={createRoom}
        >
          Create Room
        </button>
        <input 
          placeholder="Room ID" 
          className="text-black p-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200" 
          value={roomId} 
          onChange={e => setRoomId(e.target.value)} 
        />
        <button 
          className="bg-gray-900 p-2 text-white dark:bg-gray-900 dark:text-white rounded hover:bg-gray-800 transition-colors duration-200" 
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
      {isInCall && (
  <div id="video-call-frame" className="w-full h-full"></div>
)}
      {!isInCall && (
        <div className="flex">
          <div className="flex-1">
            <LeftSide />
          </div>
          <div className="flex-1 overflow-auto h-full">
            <CardGrid />
          </div>
        </div>
      )}
    </div>
  );
}
