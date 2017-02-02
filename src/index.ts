import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import db from './db';

import mainRoutes from './routes';

const PORT = 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(mainRoutes(db));

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
