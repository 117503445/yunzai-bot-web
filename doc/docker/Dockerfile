FROM node:lts-slim AS fe-builder

COPY src/yunzai-web-fe /workspace/yunzai-web-fe
WORKDIR /workspace/yunzai-web-fe
RUN npm install pnpm -g && pnpm install && pnpm run build

FROM node:lts-slim AS runtime

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y curl wget gnupg git python3-pip fonts-wqy-microhei xfonts-utils chromium fontconfig libxss1 libgl1 \
    && apt-get autoremove \
    && apt-get clean

RUN fc-cache -f -v
RUN npm install pnpm -g
RUN ln -s /usr/bin/python3 /usr/bin/python \
    && curl -fsSL https://install.python-poetry.org | python - \
    && ln -s /$HOME/.local/bin/poetry /usr/bin \
    && poetry config virtualenvs.in-project true
RUN rm -rf /var/cache/* \
    && rm -rf /tmp/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY src/Yunzai-Bot /workspace/Yunzai-Bot
COPY --from=fe-builder /workspace/yunzai-web-fe/dist /workspace/Yunzai-Bot/web-data

WORKDIR /workspace/Yunzai-Bot
RUN pnpm install && pnpm add image-size fastify @fastify/static @fastify/cors @fastify/basic-auth uuid -w && mkdir ./data
EXPOSE 8080
ENTRYPOINT [ "node", "./lib/tools/server.js" ]