FROM node:14.17.3 as build-stage
WORKDIR /app
COPY client-app/ .
RUN npm install
RUN npm run build


# этап production (production-stage)
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
