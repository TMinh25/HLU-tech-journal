const SERVER = {
  url: process.env.BACKEND_URL || "http://localhost:3000",
};

const STREAM_CHAT = {
  key: process.env.STREAM_KEY || "wfkg5ysm9qcp",
};

const config = {
  server: SERVER,
  streamChat: STREAM_CHAT,
};

export default config;
