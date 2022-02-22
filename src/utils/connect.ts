import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/logger';

function connect() {
    const dbUri = config.get<string>('dbUri')
    return mongoose.connect(dbUri)
    .then(() => logger.info('connected to db.'))
    .catch(() => {
        logger.error('error in db connection.');
        process.exit(1);
    })
}
export default connect;