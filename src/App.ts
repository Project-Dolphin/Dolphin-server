import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { busRouter } from './routes/busRouter';
import { calendarRouter } from './routes/calendarRouter';
import { dietRouter } from './routes/dietRouter';
import { homeRouter } from './routes/homeRouter';
import { noticeRouter } from './routes/noticeRouter';
import { shuttleRouter } from './routes/shuttleRouter';
import { weatherRouter } from './routes/weatherRouter';

export class App {
  private express: express.Application;
  private httpServer: http.Server;

  constructor() {
    this.express = express();
  }

  public initialize() {
    this.express.use(morgan('dev'));
    this.setRouters();
  }

  private setRouters() {
    this.express.use('/', homeRouter);
    this.express.use('/bus', busRouter);
    this.express.use('/calendar', calendarRouter);
    this.express.use('/notices', noticeRouter);
    this.express.use('/diet', dietRouter);
    this.express.use('/weather', weatherRouter);
    this.express.use('/shuttle', shuttleRouter);
  }

  public async run(port: number): Promise<void> {
    this.httpServer = this.express.listen(port);
  }

  public async close(): Promise<void> {
    await this.httpServer?.close();
  }
}
