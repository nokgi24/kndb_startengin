import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import { earthquake_emergency, data_system } from './earthquake_return.js';
import { transformEarthquakeData } from './transfer.js';

const app = express();
const PORT = process.env.PORT || 4040;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// 이 함수에서 지진 정보를 업데이트하고 메시지를 Discord로 전송합니다.
async function handleEarthquakeUpdate() {
  try {
    console.log('Updating earthquake information...');
    await earthquake_emergency(); // 지진 정보 업데이트
    console.log('Update complete.');
  } catch (error) {
    console.error('Error updating earthquake information:', error);
  }
}

// 주기적으로 handleEarthquakeUpdate 함수를 호출
setInterval(handleEarthquakeUpdate, 10000);

app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    let data_system_1=0;
    let description = '';
    let color_x;
    let title = '';
    let mt = '';
    let inT = '';
    let dep = '';
    let tmFc = '';
    let same= 0;

    try {
      // Assuming transformEarthquakeData is called to fetch the latest data
      const transformedData = await transformEarthquakeData();
      console.log('Current data_system value:', data_system);
     if (data_system_1 === '2') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '3') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '5') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '11') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '12') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '13') {
        data_system_1=data_system;
        same= 0;
      } else if (data_system_1 === '14') {
        data_system_1=data_system;
        same= 0;
      } else {
        same= 1;
      }
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
        description = '국내 지진조기경보가 발표되었습니다. 해당지역에서는 강한 흔들림에 주의하시기 바랍니다. 본 정보는 속도가 가장 빠른 P파 만을 이용한 정보 입니다.';
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

      if (same===0) {
        mt = transformedData[0].mt || '정보 없음';
        inT = transformedData[0].inT || '정보 없음';
        dep = transformedData[0].dep || '정보 없음';
        tmFc = transformedData[0].tmFc || '정보 없음';
      }
    } catch (error) {
      console.error('Error processing earthquake data:', error);
      title = '[오류]';
      description = '지진 정보 처리 중 오류가 발생했습니다.';
      color_x = 0xff0000; // 빨간색
    }
  if(data_system_1 != 0){
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
                { name: '발표시각 ', value: tmFc, inline: true }
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
} else {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '알 수 없는 명령어입니다.',
      }
    });
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});



