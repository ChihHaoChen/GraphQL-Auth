import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
  async deleteUser(parent, args, { prisma }, info) {
    // leave verification check to prisma
    return prisma.mutation.deleteUser({ where: { id } }, info)
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
  createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost({  
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info)
  },
  async updateUser(parent, args, { prisma }, info)  {
    const { id, data } = args

    return prisma.mutation.updateUser({ where: { id }, data }, info)
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: args.id } }, info)
  },
  updatePost(parent, args, { prisma }, info)  {
    const { id, data } = args
    return prisma.mutation.updatePost({
      where: { id },
      data
    }, info)
  },
  createComment(parent, args, { prisma }, info) {
    const { text, author, post } = args.data
    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: {
            id: author
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
  deleteComment(parent, args, { prisma }, info)  {
    const { id } = args
    return prisma.mutation.deleteComment({
      where: { id }
    }, info)
  },
  updateComment(parent, args, { prisma }, info) {
    const { id, data } = args
    return prisma.mutation.updateComment({
      data,
      where: { id }
    }, info)
  }
}


export { Mutation as default }