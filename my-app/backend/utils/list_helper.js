const _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogList) => {
  return blogList.reduce((acc, cur) => cur.likes + acc, 0)
}

const favoriteBlog = (blogList) => {
  let result = blogList.reduce((prev, cur) => {
    return prev.likes > cur.likes ? prev : cur
  }, 0)
  return {
    title: result.title,
    author: result.author,
    likes: result.likes
  }
}

const mostBlogs = (blogList) => {
  let result = _.countBy(blogList, (blog) => {
    return blog.author
  })
  let lastIndex = Object.keys(result).length - 1
  return {
    author: Object.keys(result)[lastIndex],
    blogs: Object.values(result)[lastIndex]
  }
}

const mostLikes = (blogList) => {
  let groupByAuthor = _.groupBy(blogList, 'author')
  let noOfAuthors = Object.keys(groupByAuthor).length
  let totalLikesArray = new Array(noOfAuthors).fill(0)
  let authorArray = new Array(noOfAuthors).fill('')

  for (let i = 0; i < noOfAuthors; i++) {
    authorArray[i] = _.filter(blogList, { 'author': Object.keys(groupByAuthor)[i] })
  }

  for (let i = 0; i < noOfAuthors; i++) {
    for (let j = 0; j < authorArray[i].length; j++) {
      totalLikesArray[i] += authorArray[i][j].likes
    }
  }

  let iOfhighestScore = totalLikesArray.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

  return {
    author: authorArray[iOfhighestScore][0].author,
    likes: totalLikesArray[iOfhighestScore]
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}