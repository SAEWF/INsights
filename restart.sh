pm2 stop minter
pm2 start --name minter "yarn start:custom"
pm2 save
