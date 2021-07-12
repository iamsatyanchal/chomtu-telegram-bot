// eslint-disable-next-line import/no-unresolved
import ytdl from 'ytdl-core';

export default async function getVideoInfo(url) {
  try {
    const result = await ytdl.getInfo(url);
    // console.log(result['formats']);
    // console.log(result['formats']);
    const webms = result.formats.filter((item) => item.container === 'mp4');
    // console.log(webms);
    const audioUrls = webms.map((item) => item.url);
    // eslint-disable-next-line no-console
    console.log(audioUrls[0]);
    if (!audioUrls.length > 0) {
      return { status: false, message: 'No audio found for that video' };
    }
    // console.log(webms);
    // console.log(audioUrls);
    return { status: true, url: audioUrls[0] };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: false, message: e.message };
  }
}
