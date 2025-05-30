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
import moment from "moment";
import { saveChannelSetting, getChannelSetting } from './supabaseHelpers.js';
import { supabase } from './supabaseClient.js';

const app = express();
const PORT = process.env.PORT;
let same = 0;
let selectedChannelId = null;
const guildChannelMap = {};

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
console.log("토큰 길이:", process.env.DISCORD_TOKEN?.length);
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
      description = '지진조기경보가 활성화되었습니다. 강한 흔들림에 주의하시기 바랍니다. (본정보는 속도가 빠른 P파 만을 이용해서 생성되었습니다. 추후 속보에 유의 바랍니다.)';
      color_x = 0xfd2b2b;
      break;
    case '12':
      title = '[국외지진조기경보]';
      description = '국외 지진조기경보가 발표되었습니다. 주의하시기 바랍니다.';
      color_x = 0xfd2b2b;
      break;
    case '13':
      title = '[조기경보 정밀분석]';
      description = '조기경보 정밀분석 정보입니다. 여진 발생 가능성에 유의하세요.';
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
    let transformedData = 0;
    console.log('Updating earthquake information...');
    if(await earthquake_emergency()){
       transformedData = await fetchEarthquakeData();
    }
    if (!transformedData || transformedData.length == 0) {
      console.log('현재 지진 정보가 없습니다.');
      return; 
    }else{
      handleEarthquakeUpdate_12();
    }
    } catch (error) {
    console.error('Error updating earthquake information:', error);
  }
};

async function handleEarthquakeUpdate_12() {
  

    if (['2', '3', '5', '11', '12', '13', '14'].includes(data_system)) {
      same = 0;

      let title = '[정보]';
      let description = '지진 정보가 업데이트되었습니다.';
      let color_x = 0x00ff00; // 기본값 설정

      try {
        const { title: msgTitle, description: msgDescription, color_x: msgColor } = getEarthquakeMessage(data_system);
        title = msgTitle || title; 
        description = msgDescription || description; 
        color_x = msgColor || color_x;

        function formatDateTime(str) {
          if (!/^\d{12}$/.test(str)) {
            throw new Error("형식이 잘못되었습니다. 12자리 숫자여야 합니다.");
          }

          const year = str.slice(0, 4);
          const month = str.slice(4, 6);
          const day = str.slice(6, 8);
          const hour = str.slice(8, 10);
          const minute = str.slice(10, 12);

          return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
        }
        function formatdep(str){
          const Dep_Km= str + 'KM';
          return Dep_Km;
        }
        const mt = transformedData[0].mt || '정보 없음';
        const inT = transformedData[0].inT || '정보 없음';
        const dep = formatdep(transformedData[0].dep) || '정보 없음';
        const tmFc = formatDateTime(transformedData[0].tmFc) || '정보 없음';
        const loc = transformedData[0].loc || '정보 없음';
        const img = transformedData[0].img || 'https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_1280.jpg';
        const fields = [
          { name: 'M', value: mt, inline: true },
          { name: '깊이', value: dep , inline: true },
          { name: '발표시각', value: tmFc, inline: true },
          { name: '위치', value: loc, inline: true }
        ];

        if (data_system !== '12') {
          fields.splice(1, 0, { name: '최대 측정 진도', value: inT, inline: true });
        }

       for (const [guildId, channelId] of Object.entries(guildChannelMap)) {
          const channel = client.channels.cache.get(channelId);
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
            console.error(`지정된 채널을 찾을 수 없습니다. (Guild: ${guildId})`);
          }
        }
      } catch (error) {
        console.error('Error processing earthquake data:', error);
        title = "[오류]";
        description = "지진 정보 처리 중 오류가 발생했습니다.";
        color_x = 0xff0000;

        for (const [guildId, channelId] of Object.entries(guildChannelMap)) {
          const channel = client.channels.cache.get(channelId);
          if (channel) {
            await channel.send({
              embeds: [
                {
                  title: title,
                  description: description,
                  fields: [],
                  timestamp: new Date(),
                  color: color_x,
                  footer: {
                    text: '기상청_kma제공'
                  }
                }
              ]
            });
          }
        }
      }
    } else {
      console.log('현재 지진 정보가 없습니다.');
    }
  
}

setInterval(handleEarthquakeUpdate, 1000);

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const { type, data, guild_id } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name: commandName, options } = data;

    if (commandName === 'ping') {
      const apiLatency = Math.round(client.ws.ping);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Pong! API 지연 시간: ${apiLatency}ms`
        }
      });
    }

    if (commandName === 'setchannel') {
      const channelId = options.find(option => option.name === 'channel').value;

      await supabase
        .from('kndb_data')
        .upsert([{ guild_id, channel_id: channelId }]);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `자동 메시지를 보낼 채널이 <#${channelId}>로 설정되었습니다.`
        }
      });
    }

    if (commandName === 'channel') {
      const { data: result } = await supabase
        .from('kndb_data')
        .select('channel_id')
        .eq('guild_id', guild_id)
        .single();

      if (result?.channel_id) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `현재 설정된 채널은 <#${result.channel_id}> 입니다.`
          }
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '현재 설정된 채널이 없습니다. 먼저 /setchannel 명령어로 채널을 설정하세요.'
          }
        });
      }
    }
  }

  res.sendStatus(404);
});


    



app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
