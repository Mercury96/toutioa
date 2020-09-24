// PostCSS 的配置文件。
module.exports = {
  plugins: {
    // autoprefixer 是一个自动添加浏览器前缀的 PostCss 插件，browsers 用来配置兼容的浏览器版本信息，但是写在这里的话会引起编译器警告。
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // 表示根元素字体大小，它会根据根元素大小进行单位转换
      rootValue: 37.5,
      // 用来设定可以从 px 转为 rem 的属性 * 就是所有属性都要转换，width 就是仅转换 width 属性
      propList: ['*']
    }
  }
}
