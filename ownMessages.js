require('dotenv').load();

module.exports =
	(app, client) => {
		app.get('/ownMessages', (request, response) => {
			if (request.session.user) {
			let userName = request.session.user
			let userid = 0
			let myMessages = []
			const query = {
				text: `SELECT user_id FROM users where username='${userName}'`}
			client.query(query, (err, result) => {
				if (err) throw (err)
				userid = result.rows[0].user_id
				const query2 = {
						text: (`SELECT * FROM messages WHERE user_id='${userid}'`)
							}
				client.query(query2, (err, res) => {
					if (err) throw (err)
					   myMessages.push(res)
					response.render('ownMessages', { data: myMessages })           
				})       
			})
		}
		else {
				response.send("You are not logged in")
			}
	})
}