/*
console.log("Server siap!");
console.log("Node version:", process.version);
console.log("Folder:", __dirname);*/

import http from 'http';
import { requestListener } from './server/router';
import { config } from './config/env.config';

const server = http.createServer(requestListener);

server.listen(config.app.port, () => {
    console.log(`Server berjalan di http://localhost:${config.app.port}`);
});