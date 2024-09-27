import { CLIENT_ID, SECRET } from '$env/static/private';
import axios from 'axios';

async function getNewAuthToken() {
    let authToken;
	await axios
		.post(
			'https://accounts.spotify.com/api/token',
			{
				grant_type: 'client_credentials',
				client_id: CLIENT_ID,
				client_secret: SECRET
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		)
		.then((resp) => authToken = resp.data)
		.catch((e) => {
			console.log('Couldnt authentify...');
			return Promise.reject(e);
		});

	return authToken;
}

export async function load({ cookies }) {
    const authToken = await getNewAuthToken();
    cookies.set('authToken', JSON.stringify(authToken), { path : "/" });

	return authToken;
}