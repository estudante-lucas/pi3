const { runMigrations} = require('./src/services/database')

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
          runMigrations()
        }
    
        return config;
      }
}

module.exports = nextConfig
