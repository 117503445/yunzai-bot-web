set -evx

curl -fsSL https://get.pnpm.io/install.sh | sh -
source /root/.bashrc

PROJECT_PATH=$PWD

git clone --depth=1 -b main https://gitee.com/Le-niao/Yunzai-Bot.git
rm -rf ./Yunzai-Bot/.git
git clone --depth=1 https://gitee.com/yoimiya-kokomi/miao-plugin.git ./Yunzai-Bot/plugins/miao-plugin
rm -rf ./Yunzai-Bot/plugins/miao-plugin/.git

cd $PROJECT_PATH/yunzai-web-fe
pnpm i
pnpm build

cd $PROJECT_PATH/Yunzai-Bot
pnpm install -P
pnpm add image-size fastify @fastify/static @fastify/cors uuid -w
mkdir ./data

cd $PROJECT_PATH
cp $PROJECT_PATH/patch/template/redis.yaml $PROJECT_PATH/Yunzai-Bot/config/config/redis.yaml
cp $PROJECT_PATH/patch/template/server.js $PROJECT_PATH/Yunzai-Bot/lib/tools/server.js
cp $PROJECT_PATH/patch/template/api.rest $PROJECT_PATH/Yunzai-Bot/lib/tools/api.rest

cp $PROJECT_PATH/Yunzai-Bot/lib/config/init.js $PROJECT_PATH/Yunzai-Bot/lib/config/init.js.backup
sed -i 's/await createQQ()/\/\/await createQQ()/g' $PROJECT_PATH/Yunzai-Bot/lib/config/init.js


cp -r $PROJECT_PATH/yunzai-web-fe/dist $PROJECT_PATH/Yunzai-Bot/data/server