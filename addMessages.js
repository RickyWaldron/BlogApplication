require('dotenv').load();

module.exports = (app, client) => {
	app.get('/addMessages', (req, res) => {
	    if (req.session.user){
	   		res.render('addMessages')
		}
	    else {
	        res.send("You can only post a message when you are logged in")
	    }
	})
	app.post('/addMessages', (req, res) => {
	    let userName = req.session.user
	    let theTitle = req.body.title
	    let theMessage = req.body.bodyMessage
	    const query3 = {
	        text: (`INSERT INTO messages (title, body, user_id) 
	                VALUES ('${theTitle}', '${theMessage}', (
	                SELECT (user_id) FROM users WHERE username= '${userName}')) RETURNING *`)
	    }

	    client.query(query3, (err, result) => {
	        if (err) throw err
	        res.render('addMessages')       
	    })
	})
}