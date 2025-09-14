import { timeToSeconds } from "../utils/time.util.js";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const isValid = (url) => {
  const regexYoutubeURL =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
  return regexYoutubeURL.test(url);
};

export const getVideoId = (url) => {
  const urlObj = new URL(url);

  const searchParamId = urlObj.searchParams.get("v");
  if (searchParamId) {
    return searchParamId;
  }

  const pathnameId = urlObj.pathname.substring(1);
  if (pathnameId) {
    return pathnameId;
  }
};

function extractVideoId(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    return null;
  } catch (err) {
    console.error("URL inválida:", err);
    return null;
  }
}

export const getInfo = async ({ url }) => {
  const videoId = extractVideoId(url);

  const youtubeUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(youtubeUrl);
  const data = await res.json();

  const { title, description } = data.items[0].snippet;

  return { title, description };
};

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

    const parsed = lines.map((line) => {
      const [time, text] = line.split(" - ");
      return {
        start: timeToSeconds(time),
        text: text.trim(),
      };
    });

    return parsed.map((item, index) => {
      const next = parsed[index + 1];
      return {
        ...item,
        duration: next ? next.start - item.start : null,
      };
    });
  }

  return transcript;
};
