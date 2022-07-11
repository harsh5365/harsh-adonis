/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
	return { hello: 'world' }
})

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')

Route.get('/twitter/redirect', async ({ ally }) => {
	return ally.use('twitter').redirect()
})

Route.get('/twitter/callback', async ({ ally }) => {
	const twitter = ally.use('twitter')

	/**
	 * User has explicitly denied the login request
	 */
	if (twitter.accessDenied()) {
		return 'Access was denied'
	}

	/**
	 * Unable to verify the CSRF state
	 */
	if (twitter.stateMisMatch()) {
		return 'Request expired. Retry again'
	}

	/**
	 * There was an unknown error during the redirect
	 */
	if (twitter.hasError()) {
		return twitter.getError()
	}

	/**
	 * Finally, access the user
	 */
	const user = await twitter.user()
	return user;
})

