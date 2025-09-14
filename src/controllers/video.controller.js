import { getCaptions as getCaptionsFromAPI, getInfo, getVideoId, isValid } from "../services/video.service.js";
import { getCaptions as getCaptionsFromMongo, insertCaptions } from '../nosql/course.nosql.js';

export const getVideoController = async (req, res) => {
  try {
    const { url } = req.body

    // Required fields
    if (!url) {
      return res.status(400).json({ error: "Missing required fields: 'url'." })
    }

    // Format
    if (!isValid(url)) {
      return res.status(400).json({ error: 'Invalid value for field: \'url\'. Expected a YouTube video URL.' })
    }

    const { title, description } = await getInfo({ url })

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ data: { title, description } })
  } catch (err) {
    console.error('Error while getting video info', err.message)
    next(err)
  }

};


export const getVideoCaptionsController = async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: "Missing required fields: 'url'." })
  }

  if (!isValid(url)) {
    return res.status(400).json({ error: 'Invalid value for field: \'url\'. Expected a YouTube video URL.' })
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')

  const videoId = getVideoId(url);
  let captionsData = await getCaptionsFromMongo(videoId)
  let captions = captionsData?.captions

  if (!captions) {
    captionsData = await getCaptionsFromAPI({ url });
    captions = JSON.stringify(captionsData);

    insertCaptions(videoId, captions);
  }

  const chunks = captions.split(' ')

  for (const chunk of chunks) {
    await new Promise(r => setTimeout(r, 50));
    res.write(chunk + ' ')
  }

  res.end()
};
