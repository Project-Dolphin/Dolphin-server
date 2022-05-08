#!/bin/bash
pm2 delete ocean-view;
echo 'delte ocean-view';
pm2 start build/src/server.js --name=ocean-view --watch
echo 'restart ocean-view';
sleep 1;
echo 'All Done!';
exit;