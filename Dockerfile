# ---- build ----
FROM node:20-alpine AS build
WORKDIR /work/project1

# instala deps
COPY cloudf/project1/package*.json ./
RUN npm ci

# copia el código
COPY cloudf/project1/ ./

# build (tu package.json debe tener "build")
RUN npm run build

# ---- runtime ----
FROM nginx:alpine
COPY --from=build /work/project1/dist /usr/share/nginx/html
EXPOSE 80