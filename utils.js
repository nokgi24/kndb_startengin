import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE_URL = 'https://discord.com/api/v10/'; 

export async function DiscordRequest(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  if (options.body) options.body = JSON.stringify(options.body);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'KNDB (https://github.com/nokgi24/KNDBbot, 2.0.0)',
      },
      ...options,
    });

    if (!res.ok) {
      const data = await res.json();
      console.error(`Discord API error: ${res.status} - ${data.message}`);
      throw new Error(`Discord API error: ${data.message} (Status: ${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

export async function InstallGlobalCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;
  
  if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not defined. Please check your .env file.');
    return;
  }

  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error('Error installing global commands:', err);
  }
}

export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


