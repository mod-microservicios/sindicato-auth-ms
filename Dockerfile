# Dockerfile para sindicato-auth-ms
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma (usar URL dummy ya que solo genera código, no se conecta a la DB)
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public" npx prisma generate

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Instalar netcat para healthcheck
RUN apk add --no-cache netcat-openbsd

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluyendo Prisma CLI para migraciones)
RUN npm ci

# Copiar el cliente de Prisma generado y el código compilado desde builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/dist ./dist

# Exponer el puerto del microservicio
EXPOSE 3001

# Comando para ejecutar las migraciones y luego iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

