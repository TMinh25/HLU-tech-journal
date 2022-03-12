const SERVER = {
  url: (import.meta.env.BACKEND_URL as string) || "http://localhost:3000",
};
const STREAM_CHAT = {
  key: (import.meta.env.STREAM_KEY as string) || "wfkg5ysm9qcp",
};

const config = {
  server: SERVER,
  streamChat: STREAM_CHAT,
};

export default config;
