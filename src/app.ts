import express from 'express';
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import { deserializeUser } from './middlewares/deserializeUser';

const app = express();
app.use(express.json());
app.use(deserializeUser);

const port = config.get<number>('port');

app.listen(port, async ()  => {
    logger.info('server is running...');
    await connect();
    routes(app);
})