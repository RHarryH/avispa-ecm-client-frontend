FROM node:20.10.0-alpine

LABEL org.opencontainers.image.authors="rafalhiszpanski.pl"

ARG ECM_CLIENT_FRONTEND_DIR="/opt/avispa-ecm-client-frontend"

RUN addgroup -S avispa_ecm && adduser -S avispa_ecm -G avispa_ecm
USER avispa_ecm

WORKDIR ${ECM_CLIENT_FRONTEND_DIR}

COPY public/ ${ECM_CLIENT_FRONTEND_DIR}/public
COPY src/ ${ECM_CLIENT_FRONTEND_DIR}/src
COPY package.json ${ECM_CLIENT_FRONTEND_DIR}/
COPY tsconfig.json ${ECM_CLIENT_FRONTEND_DIR}/
COPY .env.development ${ECM_CLIENT_FRONTEND_DIR}/

RUN npm install
CMD ["npm", "start"]