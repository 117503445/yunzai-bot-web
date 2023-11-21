#!/usr/bin/env python

import subprocess
import os

# copy every plugin in ./user_plugins to ./plugins, like ./user_plugins/miao -> ./plugins/miao
def cp_plugins():
    # first check whether plugin has existed in ./plugins
    for plugin in os.listdir("./user_plugins"):
        if os.path.exists("./plugins/" + plugin):
            print("plugin %s has existed in ./plugins" % plugin)
            exit(1)
        else:
            # copy
            # subprocess.call(["cp", "-r", "./user_plugins/" + plugin, "./plugins"])
            subprocess.run(["cp", "-r", "./user_plugins/" + plugin, "./plugins"])
            print("copy plugin %s to ./plugins" % plugin, flush=True)
            

def run_server():
    print("run server", flush=True)
    subprocess.run(["node", "./lib/tools/server.js"])


def main():
    cp_plugins()
    run_server()


if __name__ == '__main__':
    main()