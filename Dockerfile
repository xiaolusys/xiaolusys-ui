from registry.aliyuncs.com/xiaolu-img/busybox:latest

run mkdir -p /var/www/site_media
add . /var/www/site_media
workdir /var/www/site_media