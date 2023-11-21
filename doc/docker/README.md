# 本地开发

在项目根目录执行

```sh
docker compose -f doc/docker/docker-compose.yml up --build
```

会在 `doc/docker` 目录下生成 `data` `config` `dev-data` 目录，其中 `dev-data` 用来储存镜像中的 VSCode Server 缓存等数据

可以通过 `http://localhost:8080` 访问项目
