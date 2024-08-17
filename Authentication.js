//인증 js

const API_BASE_URL = 'https://discord.com/api/v14/';

// 환경 변수 유효성 검사
if (!process.env.DISCORD_TOKEN) {
  throw new Error('Missing DISCORD_TOKEN in environment variables');
}

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


export async function DiscordRequest(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Payload가 있는 경우 JSON 문자열로 변환
  if (options.body) options.body = JSON.stringify(options.body);

  // node-fetch를 사용하여 요청 실행
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });

  // API 오류 처리
  if (!res.ok) {
    const data = await res.json();
    console.error(`Discord API error: ${res.status} - ${data.message}`);
    throw new Error(JSON.stringify(data));
  }

  return res;
}
