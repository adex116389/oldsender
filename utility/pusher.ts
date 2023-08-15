import Pusher from "pusher";

export const pusher = new Pusher({
  appId: "1409740",
  key: "908bf57448af32f0c002",
  secret: "ce9de04ee51cee6b1956",
  cluster: "mt1",
  useTLS: true,
});
