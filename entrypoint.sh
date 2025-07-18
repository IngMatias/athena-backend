#!/bin/sh

echo "🔧 Generando Prisma client..."
npx prisma generate

echo "🚧 Ejecutando migraciones..."
npx prisma migrate dev --name init

echo "🌱 Ejecutando seed..."
npx prisma db seed

exec npm run start