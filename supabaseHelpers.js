import { supabase } from './supabaseClient.js';

export async function saveChannelSetting(guildId, channelId) {
  await supabase
    .from('kndb_data') // 테이블 이름 소문자
    .upsert(
      { guild_id: guildId, channel_id: channelId }, // 컬럼 이름도 소문자
      { onConflict: 'guild_id' }
    );
}

export async function getChannelSetting(guildId) {
  const { data } = await supabase
    .from('kndb_data') // 테이블 이름 소문자
    .select('channel_id')
    .eq('guild_id', guildId)
    .single();

  return data?.channel_id || null;
}
