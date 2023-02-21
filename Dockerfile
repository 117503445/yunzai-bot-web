FROM 117503445/dev-front

COPY patch patch

RUN ./patch/script/patch.sh

WORKDIR /root/project/Yunzai-Bot

ENTRYPOINT [ "node", "./lib/tools/server.js" ]