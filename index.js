import express from 'express';
import env from 'dotenv';
import cors from 'cors';

import route from './route/router';

env.config({ path: './config/config.env'});

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/', route);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());

app.listen(PORT, (err) => {
  if (err) new Error(err);
  console.log(`Server on ${process.env.NODE_ENV} mode, and running in ${PORT}`);
});
