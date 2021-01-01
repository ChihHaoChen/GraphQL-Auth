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

const db = {
  users,
  posts,
  comments
}

export { db as default }
