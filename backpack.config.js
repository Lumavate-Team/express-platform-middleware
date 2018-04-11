module.exports = {
  webpack: (config, options, webpack) => {
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /(node_modules)/
    })

    return config
  }
}
