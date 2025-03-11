const { createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use (
        '/api',
        createProxyMiddleware({
            target: '3.26.147.185:4000',
            changeOrigin: true,
        })
    )
}