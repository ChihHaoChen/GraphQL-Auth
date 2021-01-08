import getUserId from '../utils/getUserId'

// With Prisma, the relational field can be directly linked with info, 
// no need to specify the relational field here
const User = {
	email: {
		fragment: 'fragment userId on User { id }',
		resolve(parent, args, { request }, info)	{
			const userId = getUserId(request, false)
	
			if (userId && userId === parent.id)	{
				return parent.email
			}	else {
				return null
			}
		}			
	}
}


export { User as default }