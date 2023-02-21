set -evx

pacman -S chromium wqy-microhei --noconfirm

PROJECT_PATH=$PWD

git clone --depth=1 -b main https://gitee.com/Le-niao/Yunzai-Bot.git
rm -rf ./Yunzai-Bot/.git
git clone --depth=1 https://github.com/yoimiya-kokomi/miao-plugin.git ./Yunzai-Bot/plugins/miao-plugin
rm -rf ./Yunzai-Bot/plugins/miao-plugin/.git

cd $PROJECT_PATH/Yunzai-Bot
mkdir ./data
pnpm install -P
pnpm add image-size fastify @fastify/static uuid -w

cd $PROJECT_PATH
cp $PROJECT_PATH/patch/template/redis.yaml $PROJECT_PATH/Yunzai-Bot/config/config/redis.yaml
cp $PROJECT_PATH/patch/template/server.js $PROJECT_PATH/Yunzai-Bot/lib/tools/server.js
cp $PROJECT_PATH/patch/template/api.rest $PROJECT_PATH/Yunzai-Bot/lib/tools/api.rest

cp $PROJECT_PATH/Yunzai-Bot/lib/config/init.js $PROJECT_PATH/Yunzai-Bot/lib/config/init.js.backup

sed -i 's/await createQQ()/\/\/await createQQ()/g' $PROJECT_PATH/Yunzai-Bot/lib/config/init.js
