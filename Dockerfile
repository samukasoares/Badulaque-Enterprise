# Dockerfile do frontend
FROM node:16-alpine AS build-stage

# Defina o diretório de trabalho e instale as dependências
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copie o código e crie a build de produção
COPY . .
RUN npm run build

# Server Nginx para servir a aplicação em produção
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponha a porta do frontend
EXPOSE 80