require('dotenv').load();
const bcrypt = require('bcrypt')


module.exports = (app, client) => {
		app.get("/login", (req, res) => {
			res.render("login")
		})
		app.post('/signup', function(req, res) {
			console.log("reached")
			let userName = req.body.username
			let password = req.body.password
			var salt = bcrypt.genSalt(10, function(error, salt) {
					console.log("reached2")
					console.log("error:" + error)
					console.log("SALT: " + salt)
                	bcrypt.hash(password, salt, null, function(err, hash) {
                		console.log("reached3")
                		console.log("the error" + err)
                		console.log("The hash", hash)
			const query = {
                  	text: (`SELECT * FROM users WHERE username = '${userName}'`)
                    }
				client.query(query, (error, result) => {
					if (error) throw error
					if (result.rows.length == 1){
					res.send("this username already exists")
					}
					else if (result.rows.length == 0){
						const query2 = {
						text: (`INSERT INTO users (username, password) VALUES ('${userName}', '${hash}') RETURNING *`)
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
	})
})
		app.post('/login', function(req, res) {
                let userName = req.body.username
                let password = req.body.password
               	bcrypt.compare(password, hash, function(err, res) {
               		console.log("true" + res)
                		console.log("the error" + err)
                		const query = {
                        	text: (`SELECT * FROM users WHERE username = '${userName}' AND password ='${hash}'`)
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
                    		res.redirect('ownMessages')
            	}
            })			
        })  
    })
}		