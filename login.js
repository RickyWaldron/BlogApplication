require('dotenv').load();
const bcrypt = require('bcrypt')


module.exports = (app, client) => {
		app.get("/login", (req, res) => {
			res.render("login")
		})
		app.post('/signup', function(req, res) {
			let userName = req.body.username
			let password = req.body.password
			bcrypt.genSalt(10, function(error, result) {
				console.log("this is the salt" + result)
				bcrypt.hash(password, result, function(err, hash) {
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
							req.session.user = userName
							res.redirect('addMessages')
						})
					}
				})
			})
		})		
	})
		app.post('/login', function(req, res) {
                let userName = req.body.username
                let password = req.body.password
                const hashQuery = {
                	text: (`SELECT password from users WHERE username='${userName}'`)
                }
                client.query(hashQuery, (errorHash, resultHash) => {
                	console.log("the resultHash" + resultHash.rows[0].password)
                	bcrypt.compare(password, resultHash.rows[0].password, function(err, resultH) {
   				 	if (resultH == true) {
                		const query = {
                        	text: (`SELECT * FROM users WHERE username='${userName}' AND password ='${resultHash.rows[0].password}'`)
   				 	}
                    client.query(query, (error, result) => {
                    	if (error) throw error
                    	if (result.rows.length == 1){
                    		req.session.user = userName
                    		res.redirect('ownMessages')
                    	}
                    	else {
                    		res.send("No user exists with this username")
	                    }		
		            })
		        } else { 
			        	res.send("password is incorrect")
			   		}
			   	})
	        })         
		})
	}			