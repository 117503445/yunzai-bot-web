# miyoushe-token-sender

将米游社 Cookie 发送至 Yunzai-Web

## 安装

安装 Chrome 插件 [tampermonkey-beta](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf)

> 使用 **tampermonkey-beta** 的原因: 米游社的 Cookie 中有些 HTTPOnly 的字段，需要通过油猴的 `GM_cookie` API 才能获取到。但是这个 API 目前只在测试版可用，稳定版还无法使用此 API。

安装脚本 <https://greasyfork.org/zh-CN/scripts/465204-miyoushe-token-sender>

## 修改配置

修改脚本中的相关配置

```js
// Yunzai-Web 的 host
const host = "https://example.yunzai-web.com"

// Basic Auth 的用户名 / 密码, 为空则不使用 Basic Auth
const username = "user1"
const password = "pass1"
```

## 使用方法

访问 [米游社](https://www.miyoushe.com/ys/)

点击页面右上方的按钮
