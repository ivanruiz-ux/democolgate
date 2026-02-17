# ---- build ----
FROM node:20-alpine AS build
WORKDIR /work

# instala deps
COPY cloudf/package*.json ./cloudf/
RUN cd cloudf && npm install

# copia el código
COPY cloudf ./cloudf

# build (ajusta si tu script se llama diferente)
RUN cd cloudf && npm run build

# ---- runtime ----
FROM nginx:alpine
# UI5 suele generar dist/ o webapp/ dependiendo del setup
# si tu build genera "dist", esto está bien:
COPY --from=build /work/cloudf/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx escucha 80 por defecto
EXPOSE 80