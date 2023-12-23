# 米游社手动验证

原仓库 <https://gitee.com/QQ1146638442/GT-Manual/tree/master>

* 此demo仅提供思路，可以参考demo自行编写内容至您的站点
 
* ~~使用Yunzai-Bot可以参考此[提交](https://gitee.com/QQ1146638442/Miao-Yunzai/commit/c286fd0627253f8790912ad5802d6da0b9192774)~~  
使用Miao-Yunzai可以参考此插件[GT-Manual-plugin](https://static.hlhs-nb.cn/upload/GT-Manual-plugin.zip)  
若您不想部署demo或没有公网地址可以使用他人提供的公益接口
 
* 值得一提的是QQ不允许直接访问IP地址  
需要添加域名解析或复制地址到浏览器访问  
 
* 若外部网络无法访问地址请前往防火墙放行对应端口，具体操作需自行百度

# 测试

```
git clone https://gitee.com/QQ1146638442/GT-Manual.git
cd GT-Manual
npm install
```
修改config.yaml配置
```
# 前台启动
node app

# 后台启动
npm start
# 显示log
npm run log
```