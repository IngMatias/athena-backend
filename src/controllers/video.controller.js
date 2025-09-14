import { getInfo, getTranscription, getVideoId, isValid } from "../services/video.service.js";
import { getCaptions as getMongoCaptions, insertCaptions } from '../nosql/course.nosql.js';

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
  // Required fields
  if (!url) {
    return res.status(400).json({ error: "Missing required fields: 'url'." })
  }

  // Format
  if (!isValid(url)) {
    return res.status(400).json({ error: 'Invalid value for field: \'url\'. Expected a YouTube video URL.' })
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')

  const mongoCaptions = undefined //await getMongoCaptions(getVideoId(url))

  if (mongoCaptions?.captions) {
    const chunks = mongoCaptions.captions.split(" ");

    for (const chunk of chunks) {
      res.write(chunk + " ")
    }

  } else {
    let transcript = ""

    for await (const chunk of getTranscription({ url })) {
      transcript += chunk
      res.write(chunk)
    }

    const saved = await insertCaptions(getVideoId(url), transcript)
  }

  res.end()
};
