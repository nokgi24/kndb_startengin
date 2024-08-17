// Authentication.js
import { verifyKey } from 'discord-interactions';

// Discord 요청 검증 함수
export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      console.warn('Invalid Discord request signature');
      res.status(401).send('Invalid request signature');
      throw new Error('Bad request signature');
    }
  };
}

