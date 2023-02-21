FROM 117503445/dev-front

COPY patch patch

RUN ./patch/script/patch.sh

ENTRYPOINT [ "node", "./Yunzai-Bot/lib/tools/server.js" ]