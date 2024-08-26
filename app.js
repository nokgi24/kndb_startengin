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

// 일반적인 요청에 대해서는 express.json() 사용
app.use('/protected', verifyRequest);
app.use('/api', express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

async function handleEarthquakeUpdate() {
  try {
    console.log('Updating earthquake information...');
    await earthquake_emergency();
    if (['2', '3', '5', '11', '12', '13', '14'].includes(data_system)) {
      data_system_1 = data_system;
      same = 0;
    } else {
      same = 1;
    }
    console.log("datasystem_1:", data_system_1);
  } catch (error) {
    console.error('Error updating earthquake information:', error);
  }
}

setInterval(handleEarthquakeUpdate, 10000);

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const { type, data } = req.body;
	
  if (type === InteractionType.PING) {
    console.log("pong");
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
	  
    try {
      const transformedData = await fetchEarthquakeData();

      switch (data_system_1) {
        case '2':
          title = '[국외지진정보]';
          description = '국외 지진정보가 발표되었습니다. 해당지역에서는 주의하시기 바랍니다.';
          color_x = 0xfd2b2b;
          break;
        case '3':
          title = '[국내지진정보]';
          description = '국내 지진정보가 발표되었습니다. 해당지역에서는 강한 흔들림에 주의하시기 바랍니다.';
          color_x = 0xece632;
          break;
        case '5':
          title = '[국내지진정보(재통보)]';
          description = '국내 지진정보(재통보)가 발표되었습니다. 확인 후 주의하시기 바랍니다.';
          color_x = 0xece632;
          break;
        case '11':
          title = '[국내지진조기경보]';
          description = '국내 지진조기경보가 발표되었습니다. 해당지역에서는 강한 흔들림에 주의하시기 바랍니다.';
          color_x = 0xfd2b2b;
          break;
        case '12':
          title = '[국외지진조기경보]';
          description = '국외 지진조기경보가 발표되었습니다. 주의하시기 바랍니다.';
          color_x = 0xfd2b2b;
          break;
        case '13':
          title = '[조기경보 정밀분석]';
          description = '조기경보 정밀분석 정보입니다. 지진 발생 가능성에 유의하세요.';
          color_x = 0xece632;
          break;
        case '14':
          title = '[조기경보 조기분석]';
          description = '지진속보(조기분석) 정보입니다. 최신 정보를 확인하세요.';
          color_x = 0xece632;
          break;
        default:
          title = '[현재발생지진없음]';
          description = '현재 지진 정보가 없습니다.';
          color_x = 0x00ff00;
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '',
              embeds: [
                {
                  title: title,
                  description: description,
                  timestamp: new Date(),
                  color: color_x,
                }
              ]
            }
          });
      }

      mt = transformedData[0].mt || '정보 없음';
      inT = transformedData[0].inT || '정보 없음';
      dep = transformedData[0].dep || '정보 없음';
      tmFc = transformedData[0].tmFc || '정보 없음';
      loc = transformedData[0].loc || '정보없음';

    } catch (error) {
      console.error('Error processing earthquake data:', error);
      title = '[오류]';
      description = '지진 정보 처리 중 오류가 발생했습니다.';
      color_x = 0xff0000;
    }

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
              { name: '발표시각 ', value: tmFc, inline: true },
              { name: '위치 ', value: loc, inline: true }
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
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
