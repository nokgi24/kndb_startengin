import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { verifyRequest } from './Authentication.js';  
import { earthquake_emergency, data_system } from './earthquake_return.js';
import { transformEarthquakeData } from './transfer.js';
import { Client, Events, GatewayIntentBits } from 'discord.js'; 
import { fetchEarthquakeData } from './earthquake.js';

const app = express();
const PORT = process.env.PORT || 4030;
let data_system_1 = 0;
let same = 0;
let description = '';
let color_x;
let title = '';
let mt = '';
let inT = '';
let dep = '';
let tmFc = '';
let loc = '';
// Discord client 설정
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);


app.get('/', (req, res) => {
  res.send('Server is running');
});


async function handleEarthquakeUpdate() {
  try {
    console.log('Updating earthquake information...');
    await earthquake_emergency();
     if (data_system === '2') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '3') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '5') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '11') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '12') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '13') {
        data_system_1 = data_system;
        same = 0;
      } else if (data_system === '14') {
        data_system_1 = data_system;
        same = 0;
      } else {
        same = 1;
      }
    console.log("datasystem_1");
    console.log(data_system_1);
  } catch (error) {
    console.error('Error updating earthquake information:', error);
  }
}

setInterval(handleEarthquakeUpdate, 10000);

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    console.log("Received PING");
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
   
    try {
      const transformedData = await fetchEarthquakeData();

      mt = transformedData[0].mt || '정보 없음';
      inT = transformedData[0].inT || '정보 없음';
      dep = transformedData[0].dep || '정보 없음';
      tmFc = transformedData[0].tmFc || '정보 없음';
      loc = transformedData[0].loc || '정보 없음';
      console.log(`Received data: ${mt}, ${inT}, ${dep}, ${tmFc}, ${loc}`);

      // 각 data_system_1 값에 따라 응답을 설정합니다.
      if (data_system_1 === '2') {
        title = '[국외지진정보]';
        description = '국외 지진정보가 발표되었습니다. 해당지역에서는 주의하시기 바랍니다.';
        color_x = 0xfd2b2b;
      } else if (data_system_1 === '3') {
        title = '[국내지진정보]';
        description = '국내 지진정보가 발표되었습니다. 해당지역에서는 강한 흔들림에 주의하시기 바랍니다.';
        color_x = 0xece632;
      } else if (data_system_1 === '5') {
        title = '[국내지진정보(재통보)]';
        description = '국내 지진정보(재통보)가 발표되었습니다. 확인 후 주의하시기 바랍니다.';
        color_x = 0xece632;
      } else if (data_system_1 === '11') {
        title = '[국내지진조기경보]';
        description = '국내 지진조기경보가 발표되었습니다. 해당지역에서는 강한 흔들림에 주의하시기 바랍니다.';
        color_x = 0xfd2b2b;
      } else if (data_system_1 === '12') {
        title = '[국외지진조기경보]';
        description = '국외 지진조기경보가 발표되었습니다. 주의하시기 바랍니다.';
        color_x = 0xfd2b2b;
      } else if (data_system_1 === '13') {
        title = '[조기경보 정밀분석]';
        description = '조기경보 정밀분석 정보입니다. 지진 발생 가능성에 유의하세요.';
        color_x = 0xece632;
      } else if (data_system_1 === '14') {
        title = '[조기경보 조기분석]';
        description = '지진속보(조기분석) 정보입니다. 최신 정보를 확인하세요.';
        color_x = 0xece632;
      } else {
        title = '[현재발생지진없음]';
        description = '현재 지진 정보가 없습니다.';
        color_x = 0x00ff00;
      }

    } catch (error) {
      console.error('Error processing earthquake data:', error);
      title = '[오류]';
      description = '지진 정보 처리 중 오류가 발생했습니다.';
      color_x = 0xff0000;
    }

    if (data_system_1 !== '0') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '',
          embeds: [
            {
              title: title,
              description: description,
              fields: [
                { name: 'M', value: mt, inline: true },
                { name: '최대 측정 진도', value: inT, inline: true },
                { name: '깊이', value: dep, inline: true },
                { name: '발표시각', value: tmFc, inline: true },
                { name: '위치', value: loc, inline: true }
              ],
              timestamp: new Date(),
              color: color_x,
              footer: {
                text: '기상청_kma제공'
              }
            }
          ]
        }
      });
    } else {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '알 수 없는 명령어입니다.',
        }
      });
    }
  } else {
    console.error('Unsupported interaction type:', type);
    return res.status(400).send({ error: 'Unsupported interaction type' });
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});



