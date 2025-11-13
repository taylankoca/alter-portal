#!/bin/bash

# Hata durumunda betiği sonlandır
set -e

# Proje dizinine git
cd /var/www/portal.alter.com.tr

echo "GIT: Son değişiklikler alınıyor..."
# 'main' branch'inden son değişiklikleri çek. Eğer branch adınız farklıysa (örneğin 'master'), burayı güncelleyin.
git pull origin main

echo "NPM: Bağımlılıklar yükleniyor..."
npm install

echo "NEXT.JS: Proje build ediliyor..."
npm run build

echo "PM2: Uygulama yeniden başlatılıyor..."
# pm2'deki mevcut 'portal-frontend' uygulamasını yeniden başlat
pm2 restart portal-frontend

echo "Dağıtım tamamlandı!"
