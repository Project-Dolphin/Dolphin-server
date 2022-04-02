import { App } from './App';

const port = 8080;

const app = new App();

app.initialize();

app
  .run(port)
  .then(() => {
    console.log(`This Server is running at ${port}`);
  })
  .catch((e) => {
    console.error('Server error: ', e);
    process.exit(9);
  });
