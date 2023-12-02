/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, {buildId, dev, isServer, desaultLoaders, webpack}) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    }
}
// test

module.exports = nextConfig
