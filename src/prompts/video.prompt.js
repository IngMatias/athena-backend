import { getContent } from '../utils/prompt.util.js';

export const getCaptionsMessages = ({ title, description, youtubeCaptions }) => {
  return [
    {
      role: 'system',
      content: getContent(getSystemPrompt())
    },
    {
      role: 'user',
      content: getContent(getUserPrompt({ title, description, youtubeCaptions }))
    }
  ]
}

const example = [
  {
    start: 0,
    duration: 2.5,
    transcription: 'Ola a todos, bienvenidos a este tutorial sobre inteligencia artificial.',
    text: 'Hola a todos, bienvenidos a este tutorial sobre inteligencia artificial.'
  },
  {
    start: 2.5,
    duration: 2.5,
    transcription: 'En este video, exploraremos los conceptos básicos de IA,',
    text: 'En este video, exploraremos los conceptos básicos de IA,'
  },
  {
    start: 5.0,
    duration: 2.8,
    transcription: 'como funciona el aprendizaje automático y algunas aplicaciones practicas.',
    text: 'Cómo funciona el aprendizaje automático y algunas aplicaciones prácticas.'
  },
  {
    start: 7.8,
    duration: 2.4,
    transcription: 'También veremos como puedes empezar a implementar tus propios modelos.',
    text: 'También veremos cómo puedes empezar a implementar tus propios modelos.'
  },
  {
    start: 10.2,
    duration: null,
    transcription: 'Si tienes alguna duda, no dudes en dejarla en los comentarios.',
    text: 'Si tienes alguna duda, no dudes en dejarla en los comentarios.'
  }
]

const getSystemPrompt = () => {
  return `
      Tu respuesta debe ser estár en formato JSON y debe utilizar las propiedades(keys) del siguiente JSON: ${JSON.stringify(example)}.
      Debes mantener el texto que sea coherente y tenga sentido e intetntar corregir aquel texto que no lo tenga.
      Agrupa el texto para que represente 2 oraciones cada objeto de la lista.
      Tu respuesta debe ser texto plano y sin markdown.
      A continuación se te enviará el título del video, su descripción y las captions a corregir.
    `
}

const getUserPrompt = ({ title, description, youtubeCaptions }) => {
  return `
    El título del video es: ${title}.
    La descripción del video es: ${description}.
    El JSON de las captions es: ${JSON.stringify(youtubeCaptions)}
  `
}
