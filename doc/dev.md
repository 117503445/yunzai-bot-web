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
node ./lib/tools/server.js
```

## 本地构建

```sh
docker build -t 117503445/yunzai-bot .
docker push 117503445/yunzai-bot
docker tag 117503445/yunzai-bot registry.cn-hangzhou.aliyuncs.com/117503445-mirror/yunzai-web
docker push registry.cn-hangzhou.aliyuncs.com/117503445-mirror/yunzai-web
```

## 本地开发

在项目根目录执行

```sh
docker compose -f doc/docker/docker-compose.yml up --build
```

会在 `doc/docker` 目录下生成 `data` `config` `dev-data` 目录，其中 `dev-data` 用来储存镜像中的 VSCode Server 缓存等数据

可以通过 `http://localhost:8080` 访问项目
