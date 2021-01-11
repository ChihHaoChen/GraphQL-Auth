import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    const { first, skip, after, query } = args
    const opArgs = { first, skip, after }

    if (query) {
      opArgs.where = {
        OR: [
          { name_contains: query }
        ]
      }
    }
    // with info, the request will be independent of the sources that do the requests
    return prisma.query.users(opArgs, info)
  },
  posts(parent, args, { prisma }, info) {
    const { first, skip, after, query } = args

    const opArgs = { 
      first,
      skip,
      after,
      where: {
        published: true
      }
    }

    opArgs.where.OR = [
      { title_contains: query },
      { body_contains: query }
    ]

    return prisma.query.posts(opArgs, info)
  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const { first, skip, after } = args
    const opArgs = {
      first,
      skip,
      after, 
      where: {
        author: {
          id: userId
        }
      }
    }

    if (args.query) {
      opArgs.where.OR = [
        { title_contains: args.query },
        { body_contains: args.query }
      ]
    }

    return prisma.query.posts(opArgs, info)

  },
  comments(parent, args, { prisma }, info) {
    const { first, skip, after } = args
    const opArgs = { first, skip, after }

    if (args.query) {
      opArgs.where = {
        text_contains: args.query
      }
    }
    return prisma.query.comments(opArgs, info)
  },
  async me(parent, args, { prisma, request }, info)  {
    const userId = getUserId(request)

    return await prisma.query.user({
      where: {
        id: userId
      }
    }, info)
  },
  async post(parent, args, { prisma, request }, info)  {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [
          {
            published: true
          },  {
            author: {
              id: userId
            }
          }
        ]
      }
    }, info)

    if (posts.length === 0) {
      throw new Error('Post not found')
    }

    return posts[0]
  }
}


export { Query as default }