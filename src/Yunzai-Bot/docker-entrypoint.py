#!/usr/bin/env python

import subprocess
import os

# soft link every plugin in ./user_plugins to ./plugins, like ./user_plugins/miao -> ./plugins/miao
def link_plugins():
    buildin_plugins = [
        "example", "genshin", "other", "system"
    ]

    # when container restart, remove all plugins in ./plugins except buildin plugins
    for plugin in os.listdir("./plugins"):
        if plugin not in buildin_plugins:
            subprocess.run(["rm", "-rf", "./plugins/" + plugin])

    for plugin in os.listdir("./user_plugins"):
        if plugin in buildin_plugins:
            print(f"plugin {plugin} is buildin, please rename it", flush=True)
            exit(1)

        subprocess.run(["ln", "-s", "../user_plugins/" + plugin, "./plugins/" + plugin])
        print("copy plugin %s to ./plugins" % plugin, flush=True)
            

def run_server():
    print("run server", flush=True)
    subprocess.run(["node", "./lib/tools/server.js"])


def main():
    link_plugins()
    run_server()


if __name__ == '__main__':
    main()