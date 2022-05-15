import { App } from './App';
import { logger } from './logger';

const port = 8080;

const app = new App();

app.initialize();

app
  .run(port)
  .then(() => {
    console.log(`This Server is running at ${port}`);
  })
  .catch((e) => {
    logger.error(e);
    process.exit(9);
  });
