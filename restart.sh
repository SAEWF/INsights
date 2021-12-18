pm2 stop minter
pm2 start --name minter "serve -s build"
pm2 save
