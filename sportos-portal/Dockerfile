# Stage 1: Build an Angular Docker Image
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install --legacy-peer-deps
COPY . /app
ARG configuration=production
RUN npm run build -- --outputPath=./dist/out --configuration $configuration

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/out/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf