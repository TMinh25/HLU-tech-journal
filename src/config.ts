const SERVER = {
  // TODO: change on production
  url: import.meta.env.VITE_BACKEND_URL,
};
const STREAM_CHAT = {
  key: import.meta.env.VITE_STREAM_KEY,
};

const config = {
  server: SERVER,
  streamChat: STREAM_CHAT,
};

export default config;
