module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: ['github']
      },
      preload: "src/preload.js",
    }
  }
}