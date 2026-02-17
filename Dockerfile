# ---- build ----
FROM node:20-alpine AS build
WORKDIR /work

# instala deps
COPY /cloudf/project1/package*.json ./project1/
RUN cd project1 && npm install

# copia el código

COPY /cloudf/project1 ./project1

# build (ajusta si tu script se llama diferente)
RUN cd /cloudf/project1 && npm run build

# ---- runtime ----
FROM nginx:alpine
# UI5 suele generar dist/ o webapp/ dependiendo del setup
# si tu build genera "dist", esto está bien:
COPY --from=build /work/projects/cloudf/project1/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx escucha 80 por defecto
EXPOSE 80