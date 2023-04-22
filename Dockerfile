FROM node:14.17.3 as build-stage
WORKDIR /app
COPY client-app/ .
RUN npm install
RUN npm run build

 

# этап production (production-stage)
FROM nginx:1.23.3 as production-stage
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
