# 开发技巧

## 调试方法

先在 `docker-compose.yml` 中添加

```yaml
entrypoint: /bin/bash
stdin_open: true # docker run -i
tty: true        # docker run -t
```

attach 到容器中，修改代码

启动服务

```sh
cd Yunzai-Bot
node ./lib/tools/server.js
```

## 本地构建

```sh
docker build -t 117503445/yunzai-bot .
docker push 117503445/yunzai-bot
docker tag 117503445/yunzai-bot registry.cn-hangzhou.aliyuncs.com/117503445-mirror/yunzai-web
docker push registry.cn-hangzhou.aliyuncs.com/117503445-mirror/yunzai-web
```
