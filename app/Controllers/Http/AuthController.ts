import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {

	// adonis model login method
	public async login({request, response, auth}: HttpContextContract) {
		const { email, password } = request.all()
		const user = await User.findByOrFail('email', email)
		if (!user) {
			return response.status(401).json({
				error: {
					message: 'Invalid credentials',
				},
			})
		}
		const isValid = await auth.use('api').attempt(email, password,{expiresIn: '1h'});
		if (!isValid) {
			return response.status(401).json({
				error: {
					message: 'Invalid credentials',
				},
			})
		}
		return response.json({
			data: {
				user,
			},
		})
	}

	// adonis model register method
	public async register({request, response}: HttpContextContract) {
		const { name, email, password } = request.all()
		const user = await User.create({
			name,
			email,
			password,
		})
		return response.json({
			data: {
				user,
			},
		})
	}
}
