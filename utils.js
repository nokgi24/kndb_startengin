import 'dotenv/config';
import fetch from 'node-fetch';

const url = 'https://discord.com/api/v10/'; 
// Discord API 요청 함수
export async function DiscordRequest(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;

  if (options.body) options.body = JSON.stringify(options.body);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'KNDB (https://github.com/nokgi24/KNDBbot, 1.0.0)',
      },
      ...options,
    });

    if (!res.ok) {
      const data = await res.json();
      console.error(`Discord API error: ${res.status} - ${data.message}`);
      throw new Error(JSON.stringify(data));
    }

    return await res.json();
  } catch (error) {
    console.error('Request failed:', error);
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


