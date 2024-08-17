// Authentication.js
import fetch from 'node-fetch';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Access Token을 Discord로부터 가져오는 함수
export async function getAccessToken(code) {
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('scope', 'identify');

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching access token: ${data.error}`);
  }

  return data.access_token;
}

// 인증된 사용자의 정보를 가져오는 함수
export async function getUserInfo(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching user info: ${data.error}`);
  }

  return data;
}

// 인증된 Discord 요청을 검증하는 미들웨어
export function verifyRequest(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);
  console.log('Expected:', `Bot ${DISCORD_TOKEN}`);

  if (!authHeader || authHeader !== `Bot ${DISCORD_TOKEN}`) {
    return res.status(401).send('Unauthorized');
  }

  next();
}
