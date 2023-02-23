FROM archlinux
LABEL maintainer="117503445"

WORKDIR /root
COPY script script
RUN ./script/arch_init.sh

COPY patch patch
COPY yunzai-web-fe yunzai-web-fe
RUN ./patch/script/patch.sh

WORKDIR /root/Yunzai-Bot
ENTRYPOINT [ "node", "./lib/tools/server.js" ]