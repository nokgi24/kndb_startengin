import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { verifyRequest } from './Authentication.js';  
import { earthquake_emergency, data_system } from './earthquake_return.js';
import { Client, Events, GatewayIntentBits } from 'discord.js'; 
import { fetchEarthquakeData } from './earthquake.js';
import { registerCommands } from './commands.js';

const app = express();
const PORT = process.env.PORT || 4030;
let data_system_1 = 0;
let same = 0;
let selectedChannelId = null;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await registerCommands(readyClient); 
});

client.login(process.env.DISCORD_TOKEN);

app.use('/protected', verifyRequest);
app.use('/api', express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'setchannel') {
    const channel = options.getChannel('channel');
    selectedChannelId = channel.id;

    await interaction.reply(`자동 메시지를 보낼 채널이 ${channel.name}(으)로 설정되었습니다.`);
  }
});

function getEarthquakeMessage(data_system) {
  let title, description, color_x;

  switch (data_system) {
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
      break;
  }

  return { title, description, color_x };
}

async function handleEarthquakeUpdate() {
  try {
    console.log('Updating earthquake information...');
    await earthquake_emergency();
    const transformedData = await fetchEarthquakeData();

    if (!transformedData || transformedData.length === 0) {
      console.log('현재 지진 정보가 없습니다.');
      return; 
    }
    if (['2', '3', '5', '11', '12', '13', '14'].includes(data_system)) {
      data_system_1 = data_system;
      same = 0;
      try{
	      
	      
        const { title, description, color_x } = getEarthquakeMessage(data_system);
	
        
	
        const mt = transformedData[0].mt || '정보 없음';
        const inT = transformedData[0].inT || '정보 없음';
        const dep = transformedData[0].dep || '정보 없음';
        const tmFc = transformedData[0].tmFc || '정보 없음';
        const loc = transformedData[0].loc || '정보 없음';
	const img = transformedData[0].img || 'https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_1280.jpg';

	
    } catch (error) {
      console.error('Error processing earthquake data:', error);
      title = '[오류]';
      description = '지진 정보 처리 중 오류가 발생했습니다.';
      color_x = 0xff0000;
    }

      const fields = [
        { name: 'M', value: mt, inline: true },
        { name: '깊이', value: dep, inline: true },
        { name: '발표시각', value: formattedTmFc, inline: true },
        { name: '위치', value: loc, inline: true }
      ];

      if (data_system !== '12') {
        fields.splice(1, 0, { name: '최대 측정 진도', value: inT, inline: true });
      }

      if (selectedChannelId) {
        const channel = client.channels.cache.get(selectedChannelId);
        if (channel) {
          await channel.send({
            embeds: [
              {
                title: title,
                description: description,
                fields: fields,
                timestamp: new Date(),
                color: color_x,
		image: {
		url: img,
		},
                footer: {
                  text: '기상청_kma제공'
                }
              }
            ]
          });
        } else {
          console.error('지정된 채널을 찾을 수 없습니다.');
        }
      } else {
        console.log('채널이 지정되지 않았습니다.');
      }
      } else {
        console.log('현재 지진 정보가 없습니다.');
      }
   } catch (error) {
      console.error('Error updating earthquake information:', error);
    }
    console.log("datasystem_1:", data_system_1);
  }

setInterval(handleEarthquakeUpdate, 10000);

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const { type, data } = req.body;
	
  if (type === InteractionType.PING) {
    console.log("pong");
    return res.send({ type: InteractionResponseType.PONG });
  }
})
 


    



app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
