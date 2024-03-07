FROM node:20.10.0-alpine AS builder

LABEL org.opencontainers.image.authors="rafalhiszpanski.pl"

ARG ECM_CLIENT_FRONTEND_DIR="/avispa-ecm-client-frontend"
WORKDIR ${ECM_CLIENT_FRONTEND_DIR}

COPY public/ ${ECM_CLIENT_FRONTEND_DIR}/public
COPY src/ ${ECM_CLIENT_FRONTEND_DIR}/src
COPY package.json ${ECM_CLIENT_FRONTEND_DIR}/
COPY tsconfig.json ${ECM_CLIENT_FRONTEND_DIR}/
COPY .env.production ${ECM_CLIENT_FRONTEND_DIR}/

RUN npm install
RUN npm run build

FROM nginx:1.25.3-alpine3.18

EXPOSE 80
COPY --from=builder /avispa-ecm-client-frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

