import chokidar from 'chokidar';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import Schema from './data/schema';
import Express from 'express';
import GraphHTTP from 'express-graphql';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

let graphQLServer;
let appServer;
const app = Express();

app.use('/graphql',GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(GRAPHQL_PORT,()=>{
  console.log('graphql run on port ${GRAPHQL_PORT}');
});

function startAppServer(callback) {
  // Serve the Relay app
  const compiler = webpack({
    entry: path.resolve(__dirname, 'js', 'app.js'),
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: 'babel',
          test: /\.js$/,
        }
      ]
    },
    output: {filename: '/app.js', path: '/', publicPath: '/js/'}
  });
  appServer = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/js/',
    stats: {colors: true}
  });
  // Serve static resources
  appServer.use('/', Express.static(path.resolve(__dirname, 'public')));
  appServer.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
}
startAppServer();

