# 调试方法

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
