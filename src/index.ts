import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// import db from './db';
import * as WebSocket from 'ws';
import * as http from 'http';
import mainRoutes from './routes';
import { listerner } from './pollEmitter';

const PORT = 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(mainRoutes()); // db

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/socket' });

wss.clients.forEach((client) => {
  client.on('error', (err) => {
    console.error('Client error: ', err);
  });
});

listerner((data: any) => {
  // Send updated poll everytime we receive a new vote to everyone connected
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Client state: ', client.readyState);
      console.log('Client send data: ', data);

      client.send(JSON.stringify(data));
    }
  });
});

server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
