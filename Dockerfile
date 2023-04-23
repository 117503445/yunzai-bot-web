FROM node:alpine AS fe-builder

COPY yunzai-web-fe /app
WORKDIR /app

RUN npm install pnpm -g && pnpm install && pnpm run build

FROM archlinux
LABEL maintainer="117503445"

WORKDIR /root
COPY script script
RUN ./script/arch_init.sh

COPY patch patch
# COPY yunzai-web-fe yunzai-web-fe
RUN ./patch/script/patch.sh

COPY --from=fe-builder /app/dist ./Yunzai-Bot/web-data

WORKDIR /root/Yunzai-Bot
ENTRYPOINT [ "node", "./lib/tools/server.js" ]