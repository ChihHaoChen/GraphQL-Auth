import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
})

// prisma.query.users(null, '{ id name email posts { id title body } }').then((data) => {
// 	console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text post { id title body } author { id name }}').then((data) => {
// 	console.log('Comments data =>', JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.createPost({
// 	data: {
// 		title: "My new graphql article and post",
// 		body: "The new content created with node.js rather than the interface",
// 		published: true,
// 		author: {
// 			connect:	{
// 				id:	"ckji8nv1y00et0830dxjjmnk9"
// 			}
// 		}
// 	}
// }, '{ id title body published }').then((data) => {
// 	console.log('createPost =>', JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
// 	where: {
// 		id: "ckjijraxi02d40830y7yrrlsb"
// 	},
// 	data: {
// 		title: "Let's change the title!",
// 		body: "A renewed body with node.JS",
// 		published: true,
// 	}
// }, '{ id title body published author { id name }}').then((data) => {
// 	console.log('Updated Promise =>', JSON.stringify(data, undefined, 2))

// 	return prisma.query.comments(null, '{ id text post { id title body }}').then((data => {
// 		console.log('The udpated Comments are =>', JSON.stringify(data, undefined, 2))
// 	}))
// })

// prisma.query.posts(null, '{ id title body author { id name email }}').then((data) => {
// 	console.log("Queried Posts =>", JSON.stringify(data, undefined, 2))
// })


const createPostForUser = async (authorId, data) => {

	const userExists = await prisma.exists.User({ id: authorId })

	if	(!userExists)	{
		throw new Error('User not found')
	}

	const post = await prisma.mutation.createPost({
			data: {
				...data,
				author: {
					connect:	{
						id:	authorId
					}
				}
			}
		},  '{ author { id name email posts { id title published }} }')

	return post.author
}


const updatePostForUser = async (postId, data)	=> {

	const postExists = await prisma.exists.Post({ id: postId })

	if (!postExists)	{
		throw new Error('Post not found')
	}

	const post = await prisma.mutation.updatePost({
		where: {
			id: postId
		},
		data: { ...data } // or just data 
	}, '{ author { id name email posts { id title body published } } }')

	return post.author
}


// createPostForUser('ckji7e65f001g08304l8thpf0', {
// 	title: 'This is a new title on 2021/01/05',
// 	body: 'The content established on 2021/01/05.',
// 	published: true
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
// 	console.log(error.message)
// })

// updatePostForUser('ckjjfkp9g02ml0830db1dgvvp', {
// 	title: 'The new title after updating the function updatePostForUser',	
// 	body: 'By using prisma.exists to check if a specific post exists beforehand'
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2))	
// }).catch((error) => {
// 	console.log(error.message)	
// })
