import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import { resolvers, fragementReplacements } from './resolvers'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
  // Type definition (Schema)
  typeDefs: './src/schema.graphql', 
  resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  },
  fragementReplacements
})


server.start(() => {
  console.log('The server is up!')
})



