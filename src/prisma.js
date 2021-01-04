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
	const post = await prisma.mutation.createPost({
			data: {
				...data,
				author: {
					connect:	{
						id:	authorId
					}
				}
			}
		},  '{ id }')

	const user = await prisma.query.user({
		where: {
			id: authorId
		}
	}, '{ id name email posts { id title published }}')

	return user
}

createPostForUser('ckji7e65f001g08304l8thpf0', {
	title: 'This is the graphQL title',
	body: 'The art of graphQL',
	published: true
}).then((user) => {
	console.log(JSON.stringify(user, undefined, 2))
})

