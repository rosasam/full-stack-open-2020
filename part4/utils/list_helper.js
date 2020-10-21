const _ = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return (blog.likes || 0) + sum
  }, 0)
}

const favoriteBlog = blogs => {
  const favorite = blogs.reduce((blog1 ,blog2) => {
    return (blog1.likes || 0) > (blog2.likes || 0) ? blog1 : blog2
  }, {})
  return _.isEmpty(favorite) ? undefined : favorite
}

const mostBlogs = blogs => {
  // Goddamn I love lodash
  return _(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author: author, blogs: blogs }))
    .maxBy('blogs')
}

const mostLikes = blogs => {
  // So clean 😍
  return _(blogs)
    .groupBy('author')
    .map((blog, author) => ({ author: author, likes: _.sumBy(blog, 'likes') }))
    .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}