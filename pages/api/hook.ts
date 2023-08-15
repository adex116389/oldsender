import type { NextApiRequest } from "next";
import nextConnect from "next-connect";
import { NextApiResponseServerIO } from "../../types/next";
// import { Server } from 'socket.io'
// import { pusher } from "../../utility/pusher";

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const status = req.body.data.payload.to[0].status;
  const number = req.body.data.payload.to[0].phone_number;

  // await pusher.trigger("status", "hook", {
  //   response: `Message to ${number} ${status}`,
  // });

  // res.send(`Okay`);

  const message = {
    response: `Message to ${number} ${status}`,
  };

  res?.socket?.server?.io?.emit("status", message);
  console.log(message);

  // return message
  res.status(201).json(message);
});

export default handler;
