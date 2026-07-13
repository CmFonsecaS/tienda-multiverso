# Stage 1: Compilar la aplicación de Angular
FROM node:24.18.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Servir la aplicación compilada con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/angular-temp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
