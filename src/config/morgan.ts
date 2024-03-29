import morgan from 'morgan';

import { MorganConfigFunction } from '../ts/types';

const morganConfig: MorganConfigFunction = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    '---',
    tokens['remote-addr'](req, res),
    '-',
    tokens['user-agent'](req, res),
  ].join(' ');
};

export default morgan(morganConfig);
