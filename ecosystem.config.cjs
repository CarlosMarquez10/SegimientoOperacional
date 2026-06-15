module.exports = {
  apps: [
    {
      name: 'SeguimientoOperacional',
      script: './src/App.js',
      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'development',
        HOST: '127.0.0.1',
        PORT: 3007,
      },
      env_production: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 3007,
      }
    },
  ],
};