import { v4 as uuidv4 } from 'uuid'


const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    return prisma.mutation.createUser({ data: args.data }, info)
  },
  async updateUser(parent, args, { prisma }, info)  {
    const { id, data } = args

    return prisma.mutation.updateUser({ where: { id }, data }, info)
  },
  async deleteUser(parent, args, { prisma }, info) {
    // leave verification check to prisma
    return prisma.mutation.deleteUser({ where: { id } }, info)
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