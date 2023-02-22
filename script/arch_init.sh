set -evx

# echo "Server = https://mirrors.kernel.org/archlinux/\$repo/os/\$arch" > /etc/pacman.d/mirrorlist
echo "Server = https://mirrors.ustc.edu.cn/archlinux/\$repo/os/\$arch" > /etc/pacman.d/mirrorlist
pacman-key --init

pacman -Sy archlinux-keyring --noconfirm
pacman -Syyu --noconfirm
pacman -Syu git nano vim micro npm chromium wqy-microhei --noconfirm

