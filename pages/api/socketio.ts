import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { NextApiResponseServerIO } from "../../types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (!res.socket.server.io) {
    console.log("Socket is initializing.");
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
