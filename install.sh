git clone --depth=1 -b main https://gitee.com/Le-niao/Yunzai-Bot.git
rm -rf ./Yunzai-Bot/.git
git clone --depth=1 https://github.com/yoimiya-kokomi/miao-plugin.git ./Yunzai-Bot/plugins/miao-plugin
rm -rf ./Yunzai-Bot/plugins/miao-plugin/.git

cd Yunzai-Bot
pnpm install -P
pnpm add image-size fastify uuid -w

./Yunzai-Bot/config/config/redis.yaml


# await createQQ()

pacman -S chromium wqy-microhei --noconfirm

# pnpm install fastify -w
# pnpm install uuid -w

mkdir ./data

node ./lib/tools/server.js


./patch/script/patch.sh

TODO mini image