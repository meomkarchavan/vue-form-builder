module.exports = {
    productionSourceMap: false,
    css: {
        extract: true
    },
    devServer: {
        proxy: {
            '/server': {
                target: 'https://cs.mkcl.org/1tnTkU5kI7a4Kun9JlxkhUc1TDO', // provide proxy  for your project
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/server': ''
                }
            },
            '/cdnserver': {
                target: 'http://localhost:3034/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/cdnserver': ''
                }
            }
        }
    },
}