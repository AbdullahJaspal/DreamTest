const API_BASE_URL = 'https://api.videosdk.live/v2';

export const getToken = async () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYzVkZjk2OC04OThkLTQ5NzAtYmM5OS1lM2FhODVmMzQxM2MiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNzQ1NzEzMywiZXhwIjoxNzM4OTkzMTMzfQ.pzA1-8kwXBtzh9f0LGnM0HZgVZlMsKq4YlH9RxXYgFw';
};

export const createMeeting = async ({token}) => {
  const url = `${API_BASE_URL}/rooms`;
  const options = {
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
  };

  const {roomId} = await fetch(url, options)
    .then(response => response.json())
    .catch(error => console.error('error', error));

  console.log('room', roomId);
  return roomId;
};
