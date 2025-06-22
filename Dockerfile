FROM nginx:alpine

COPY ./dist/spa /usr/share/nginx/html

EXPOSE 9000

