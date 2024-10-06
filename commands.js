import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';
import { REST, Routes } from 'discord.js';

function createCommandChoices() {
  const commandChoices = [];
  return commandChoices;
}
const ping_command = {
  name: 'ping',
  description: 'ping',
  type: 1,
};

const check_channel = {
  name: 'channel',
  description: 'check_channel',
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
      Routes.applicationCommands(client.user.id),  
      { body: ALL_COMMANDS },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
const ALL_COMMANDS = [ check_channel, ping_command, ...commands_channel];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

