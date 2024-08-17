import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

const API_BASE_URL = 'https://discord.com/api/v14/';

// 환경 변수 유효성 검사
if (!process.env.DISCORD_TOKEN) {
  throw new Error('Missing DISCORD_TOKEN in environment variables');
}

// Discord 요청 검증 함수
export async function DiscordRequest(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Payload가 있는 경우 JSON 문자열로 변환
  if (options.body) options.body = JSON.stringify(options.body);

  try {
    // node-fetch를 사용하여 요청 실행
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'KNDB (https://github.com/nokgi24/KNDBbot, 1.0.0)',
      },
      ...options,
    });

    // 요청과 응답 로그
    console.log(`Request URL: ${url}`);
    console.log('Request Headers:', JSON.stringify({
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'KNDB (https://github.com/nokgi24/KNDBbot, 1.0.0)',
    }, null, 2));  // JSON.stringify로 헤더를 자세히 출력

    if (options.body) {
      console.log('Request Body:', JSON.stringify(JSON.parse(options.body), null, 2));  // 요청 본문도 JSON으로 상세 출력
    }

    // API 오류 처리
    if (!res.ok) {
      const data = await res.json();
      console.error(`Discord API error: ${res.status} - ${data.message}`);
      console.error('Error details:', JSON.stringify(data, null, 2));  // 오류 상세 내용 출력
      throw new Error(JSON.stringify(data));
    }

    // 응답 결과를 JSON으로 변환하여 반환
    return await res.json();

  } catch (error) {
    // 네트워크 오류 또는 예외 발생 시 추가 로그 출력
    console.error('Request failed:', util.inspect(error, { showHidden: false, depth: null, colors: true }));
    throw error;
  }
}
// 전역 명령어 설치 함수
export async function InstallGlobalCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error('Error installing global commands:', err);
  }
}

// 랜덤 이모지 반환 함수
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

// 문자열의 첫 글자를 대문자로 변환하는 함수
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

