FROM 117503445/dev-front

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

RUN pacman -Syu chromium wqy-microhei --noconfirm

ENTRYPOINT [ "zsh" ]