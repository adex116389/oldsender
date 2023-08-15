import nextConnect from 'next-connect';
import multiparty from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedRequest extends NextApiRequest {
  files: any;
}

const middleware = nextConnect<ExtendedRequest, NextApiResponse>();

middleware.use(async (req, _res, next) => {
  const form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    req.body = fields;
    req.files = files;
    next();
  });
});

export default middleware;
