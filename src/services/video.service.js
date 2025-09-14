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

const getCaptions = async ({ url }) => {
/* 
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
  const { transcript } = await response.json(); */

  const transcript = '00:00 - El TC39, que ya sabéis que es el comité que evoluciona JavaScript, está trabajando nuevas propuestas porque el lenguaje no para de evolucionar, no para, es una cosa que está viva, está\n' +
      '00:10 - loca. Entre todas las cosas nuevas hay una que tiene muy buena pinta y que nos va a permitir hacer sumas directamente, sin necesidad de utilizar por por fin reduce. ¿Veis? Antes, para hacer sumas\n' +
      '00:24 - de un array, de valores de un rey, teníamos que hacer valores puntos reduce y podíamos hacerlo así en una sola línea podíamos hacer el sumatorio de los elementos de una raíz, serán números. En\n' +
      '00:35 - este caso, además, como podéis ver, está utilizando incluso también con notaciones utilizando estos son muchos ceros, estos son muchos ceros negativos y esto, pues como podemos ver esto hace\n' +
      '00:45 - mal la suma. está haciendo mal la suma porque esto más esto menos esto debería dar 01, pero reduce no está haciendo de forma precisa la suma y esto te da cero. Es un error, como ya sabéis, pierde\n' +
      '00:59 - precisión. Por eso el nuevo método se llama math. Precis y le pasas un array con los números que quieres sumar, lo suma correctamente, ¿vale? 0.1. Y además no tienes que hacer ninguna ningún loop,\n' +
      '01:12 - ninguna iteración ni nada de esto. Tiene bastante buena pinta, todavía no ha llegado, está en fase está en la fase tres, si no me equivoco, lo cual está bastante avanzada y no me extrañaría que\n' +
      '01:24 - el año que viene sí que llegue y sería la forma en la que por fin tendremos sumas en condiciones en JavaScript. Eso sí, importante porque mucha gente aquí dice, &quot;¿Y va a sumar bien el 0.1 más el\n' +
      '01:36 - 0.2?&quot; No, no. O sea, el 0.1, ¿sabéis esto? El 0.1 + 0.2. Mira, os lo voy a enseñar aquí que lo vais a ver más claro. Cuando tú sumas 0.1 + 0.2, esto no lo va a arreglar, ¿vale? Esto no lo\n' +
      '01:50 - va a arreglar porque en realidad esto, y lo siento, eh, se lo siento, me sabe mal, pero es que esto no está roto, esto no es culpa de como tal, no es de JavaScript, es por el floating point\n' +
      '02:00 - math. Aquí tenéis la explicación y en todos los lenguajes de programación que ocurre, ¿vale? Porque esto es realmente como se está haciendo la el redondeo de la suma del del de los números binarios,\n' +
      '02:13 - o sea, que no hay otra forma, pierde precisión y ya está. O sea, estos son detalles del punto flotante, no se puede arreglar como tal, así que hay mucho lenguaje de promoción que le pasa en\n' +
      '02:22 - JavaScript. Puede ser que más adelante, quién sabe, pues sale un nuevo, no sé, trabaja con otro tipo de números, pero por ahora esto no lo va a arreglar, ¿eh? O sea, cuando utilizáis el sampleis vais\n' +
      '02:32 - a tener el mismo problema porque es que si no rompería un montón de cosas, solo para que lo sepáis. Eh, esto sería pues para sumar una lista de números en lugar de utilizar reduce. Lo haríamos pues con\n' +
      '02:42 - el Spris. Y sí que es verdad que sí que no perdería la precisión aritmética, porque hay veces que aquí con el Radius sí que se puede llegar a perder si son valores muy grandes, ¿vale? O sea, que\n' +
      '02:55 - es diferente, no es no tiene nada que ver con el punto flotante, es estamos hablando de otro de otro problema.'

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


export async function* getTranscription({ url }) {
  //const { title, description } = await getInfo({ url })
  const youtubeCaptions = await getCaptions({ url })
  console.log(youtubeCaptions, 'youtubeCaptions')

  for (const chunk of JSON.stringify(youtubeCaptions).split(' ')) {
    yield chunk + ' '
  }

  //const messages = getCaptionsMessages({ title, description, youtubeCaptions })

  //for await (const chunk of openaiExternal.chat(messages)) {
  //  yield chunk
  //}





}