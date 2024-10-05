import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { REST, Routes } from 'discord.js';

function createCommandChoices() {
  const commandChoices = [];
  return commandChoices;
}

const common_COMMAND = {
  name: 'info',
  description: 'Basic command',
  type: 1,
};

const Realtest_COMMAND = {
  name: 'real_situation_test',
  description: 'Simulate a real situation',
  type: 1,
};

const ping_command = {
  name: 'ping',
  description: 'ping',
  type: 1,
};

const commands_channel = [
  {
    name: 'setchannel',
    description: '자동 메시지를 보낼 채널을 설정합니다.',
    options: [
      {
        name: 'channel',
        description: '자동 메시지를 보낼 채널을 선택하세요.',
        type: 7, 
        required: true,
      },
    ],
  },
];

export const registerCommands = async (client) => {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      { body: ALL_COMMANDS },  
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

// 모든 명령어 배열
const ALL_COMMANDS = [common_COMMAND, Realtest_COMMAND, ping_command, ...commands_channel];

// 글로벌 명령어 설치
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

