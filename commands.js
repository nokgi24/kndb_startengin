import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const commandChoices = [];


  return commandChoices;
}

// Simple test command
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
  description: 'Simulate a real situation',
  type: 1,
};
const ALL_COMMANDS = [common_COMMAND , Realtest_COMMAND,ping_command];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
