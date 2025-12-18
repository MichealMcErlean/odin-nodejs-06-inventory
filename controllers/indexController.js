exports.showMainSearch = async (req, res, next) => {
  res.render('index', {
    title: 'Search'
  })
}