import json5 from 'json5';
import nconf from 'nconf';


export default nconf
  .env({
    lowercase: true
  })
  .required(['OAUTH_GITHUB_SECRET']) // patched required() to chain, available in next version of nconf
  .argv()
  .use('file', { format: json5, file: './configs/development.json' });
