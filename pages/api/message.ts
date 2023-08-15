import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import middleware from "../../middleware/middleware";
import tx from "telnyx";
import fs from "fs";
import { numbersToArray } from "../../utility/numbersToArray";
import { delay } from "../../utility/delay";

interface ExtendedRequest extends NextApiRequest {
  files: any;
}

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: ExtendedRequest, res: NextApiResponse) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => `+${number}`);

  const message = values.message;
  const apiKey = values.apiKey;
  const msgProfileId = values.msgProfileId;

  const telnyx = tx(apiKey);

  for (const number of numbers) {
    telnyx.messages.create(
      {
        to: number,
        text: message,
        messaging_profile_id: msgProfileId,
      },
      async (err: any, response: any) => {
        console.log(`response: `, response);

        if (err) {
          console.log(`err: `, err);
        }
      }
    );

    await delay(110);
  }

  res.send(`Okay`);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
