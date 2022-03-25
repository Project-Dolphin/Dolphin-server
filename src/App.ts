import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { busRouter } from './routes/busRouter';
import { calendarRouter } from './routes/calendarRouter';

export class App {
  private express: express.Application;
  private httpServer: http.Server;

  constructor() {
    this.express = express();
  }

  public initialize(): void {
    this.express.use(morgan('dev'));
    this.setRouters();
  }

  private setRouters(): void {
    this.express.use('/bus', busRouter);
    this.express.use('/calendar', calendarRouter);
  }

  public async run(port: number): Promise<void> {
    this.httpServer = this.express.listen(port);
  }

  public async close(): Promise<void> {
    await this.httpServer?.close();
  }
}
