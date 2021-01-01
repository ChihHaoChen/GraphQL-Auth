import { GraphQLServer } from 'graphql-yoga';


const users = [
  {
    id: '1',
    name: 'Jenson',
    email: 'chao0716@hotmail.com',
    age: 27
  },  {
    id: '2',
    name: 'Ara',
    email: 'chao700716@gmail.com',
    age: 12
  },  {
    id: '3',
    name: 'Jara',
    email: 'Test@test.com'
  }
]

const posts = [
  {
    id: '1',
    title: 'The article about graphQL',
    body: 'The pros and cons of GraphQL',
    published: true,
    author: '1'
  },  {
    id: '2',
    title: 'How to use graphQL in your React front-end',
    body: 'You need to import Apollo-Client into your project first',
    published: false,
    author: '2'
  },  {
    id: '3',
    title: 'Comparsion between Apollo-Server, express-graphQL, and graphQL-Yoga',
    body: 'The difference between these 3rd-party libraries',
    published: true,
    author: '1'
  }, {
    id: '4',
    title: 'How to deploy your graphQL project into micro-services',
    body: 'Should the database excluded or included in your deployment?',
    published: true,
    author: '3'
  }
]

const comments = [
  {
    id: '5',
    text: 'A great article about GraphQL. Lovin it!',
    author: '3',
    post: '1'
  }, {
    id: '6',
    text: 'Some questions about the further readng related articles.',
    author: '3',
    post: '2'
  }, {
    id: '7',
    text: 'Which one is the most popular framework?',
    author: '2',
    post: '3'
  }, {
    id: '8',
    text: 'Very clear explanation about deploying the GraphQL projects!',
    author: '1',
    post: '4'
  }, {
    id: '9',
    text: 'A fantastic article to illustrate the difference among them!',
    author: '2',
    post: '3'
  }
]


// Type definition (Schema)
const typeDefs = `
  type Query {
    post: Post!
    me: User!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!,
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

`

// Resolvers
const resolvers = {
  Query: {
    post()  {
      return {
        id: '1214134',
        title: 'Think and grow rich',
        body: 'A great book to recommend',
        published: true
      }
    },
    me() {
      return {
        id: 'F125968769',
        name: 'Chih-Hao Chen',
        email: 'chao0716@hotmail.com',
        age: 39
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter((post) => {
        return (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase()))
      })
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments
      }

      return comments.filter((comment) => comment.text.toLocaleLowerCase().includes(args.query.toLowerCase()))
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})


server.start(() => {
  console.log('The server is up!')
})