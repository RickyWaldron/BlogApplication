require('dotenv').load();

module.exports = (app, client) => {
		app.get("/login", (req, res) => {
			res.render("login")
		})
		app.post('/login', function(req, res) {
                let userName = req.body.username
                let password = req.body.password
                    const query = {
                        text: (`SELECT * FROM users WHERE username = '${userName}' AND password ='${password}'`)
                    }
                    client.query(query, (error, result) => {
                    	if (error) throw error
                    		console.log(result.rows.length)
                    	if (result.rows.length == 0){
                    		res.send("No user exists with this username or your password is wrong")
                    	}
                    	else {
                    		req.session.user = userName
                    		console.log("succesfully logged in")
                    		res.redirect('addMessages')
                    	}
                    })
                })
		app.post('/signup', function(req, res) {
			let userName = req.body.username
			let password = req.body.password
				const query = {
                       text: (`SELECT * FROM users WHERE username = '${userName}' AND password ='${password}'`)
                    }
			client.query(query, (error, result) => {
				if (error) throw error
				if (result.rows.length == 1){
				res.send("this username already exists")
			}
				else if (result.rows.length == 0){
					const query2 = {
					text: (`INSERT INTO users (username, password) VALUES ('${userName}', '${password}') RETURNING *`)
				}
				client.query(query2, (error, result) => {
				if (error) throw error
				console.log(result.rows)
				req.session.user = userName
				res.redirect('addMessages')
				console.log("Account created")
				})
			}
		})		
	})
}
