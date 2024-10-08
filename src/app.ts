import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import logger from "morgan";
import path from 'path';

import adminRouter from './routes/admin.ts';
import articleRouter from './routes/article.ts';
import homeRouter from './routes/home.ts';
import indexRouter from './routes/index.ts';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
// console.log(`serving static files from ${path.join(__dirname, '../public')}`)

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/article', articleRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app
