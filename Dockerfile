# Usa una imagen oficial de Node.js como base
FROM node:latest

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

# Prisma ORM
RUN npx prisma generate
RUN npx prisma db seed

# Comando para correr la aplicación
CMD ["npm", "start"]