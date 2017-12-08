require('dotenv').load();

module.exports = (app, client) => {
	app.get('/comment', (req, res) => {
		let data = req.query.data
		if (req.session.user) {
			res.render('comment', {data: data})
		}
	    else {
	        res.send("You can only comment on a post when you are logged in")
	    	}
		})
}	
