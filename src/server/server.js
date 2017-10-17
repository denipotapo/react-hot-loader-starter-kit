import chalk from 'chalk';

import app from '../server';

app.listen(process.env.PORT || 3000, () => console.log( // eslint-disable-line no-console
  chalk.bold.red('PRODUCTION SERVER: listening on port 3000')
));
