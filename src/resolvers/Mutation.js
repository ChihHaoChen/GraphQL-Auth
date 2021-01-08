import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8)  {
      throw new Error('Password must be 8 characters or longer.')
    }
    
    const password = await bcrypt.hash(args.data.password, 10)

    const user = await prisma.mutation.createUser({ 
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'TempSecret')
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    // leave verification check to prisma
    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },
  async signInUser(parent, args, { prisma })  {
    const user = await prisma.query.user({ where: { email: args.data.email }})

    if (!user)  {
      throw new Error('User not found.')
    }
    
    const isMatched = await bcrypt.compare(args.data.password, user.password)

    if (!isMatched) {
      throw new Error('Not correct password.')
    } else {
      return {
        user,
        token: jwt.sign({ userId: user.id }, 'TempSecret')
      }
    }
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return await prisma.mutation.createPost({  
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },
  async updateUser(parent, args, { prisma, request }, info)  {
    const userId = getUserId(request)

    return prisma.mutation.updateUser({ 
      where: { id: userId }, 
      data: args.data 
    }, info)
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!postExists)  {
      throw new Error('Unable to delete the post')
    }

    return prisma.mutation.deletePost({ where: { id: args.id } }, info)
  },
  async updatePost(parent, args, { prisma, request }, info)  {
    const userId = getUserId(request)
    const { id, data } = args

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists)  {
      throw new Error('Unable to update the post')
    }

    return prisma.mutation.updatePost({
      where: { id },
      data
    }, info)
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const { text, post } = args.data
    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: post
          }
        }
      }
    }, info)
  },
  async deleteComment(parent, args, { prisma, request }, info)  {
    const { id } = args
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists) {
      throw new Error('Unable to delete the comment')
    }

    return prisma.mutation.deleteComment({
      where: { id }
    }, info)
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const { id, data } = args
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists)  {
      throw new Error('Unable to update the comment')
    }

    return prisma.mutation.updateComment({
      data,
      where: { id }
    }, info)
  }
}


export { Mutation as default }