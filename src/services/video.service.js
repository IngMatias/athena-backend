// For xml parsing
import { parseString } from 'xml2js';

import { getCaptionsMessages } from '../prompts/video.prompt.js';

import openaiExternal from "../external/chatgpt.external.js";
import { timeToSeconds } from '../utils/time.util.js';

export const isValid = (url) => {
  const regexYoutubeURL = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/
  return regexYoutubeURL.test(url)
}

export const getVideoId = (url) => {
  const urlObj = new URL(url)

  const searchParamId = urlObj.searchParams.get('v')
  if (searchParamId) {
    return searchParamId
  }

  const pathnameId = urlObj.pathname.substring(1)
  if (pathnameId) {
    return pathnameId
  }
}

export const getInfo = ({ url }) => {
  return fetch(url)
    .then(res => res.text())
    .then(html => {
      const title = html.match(/<title>(.*?)<\/title>/)[1]
      const description = html.match(/"shortDescription":"(.*?)"/)[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      return { title, description }
    })
}

export const getCaptions = async ({ url }) => {
  const response = await fetch(process.env.DUMPLINGAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DUMPLINGAI_API_KEY}`,
    },
    body: JSON.stringify({
      videoUrl: url,
      includeTimestamps: true,
      timestampsToCombine: 5,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }
  const { transcript } = await response.json();

  if (transcript) {
    const lines = transcript.split("\n").filter(Boolean);

    const parsed = lines.map(line => {
      const [time, text] = line.split(" - ");
      return {
        start: timeToSeconds(time),
        text: text.trim()
      };
    });

    return parsed.map((item, index) => {
      const next = parsed[index + 1];
      return {
        ...item,
        duration: next ? next.start - item.start : null
      };
    });

  }

  return transcript;
}
