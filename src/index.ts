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
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: any) => {
  console.log('connection');

  listerner((data: any) => {
    // Send updated poll everytime we receive a new vote
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

    ws.send(JSON.stringify(data));
  });
});

server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
