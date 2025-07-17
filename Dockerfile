# Usa una imagen oficial de Node.js como base
FROM node:24.4.1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias al contenedor
COPY package.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que usará la app (ajústalo si usas otro)
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]