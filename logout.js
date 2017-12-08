require('dotenv').load();

module.exports =
	(app) => {
    app.get('/logout', function(req, res) {
        if (req.session.user) {
            req.session.destroy();
            res.send("logout success!");
        } else {
            res.send("You were not logged in")
        }
    });
}