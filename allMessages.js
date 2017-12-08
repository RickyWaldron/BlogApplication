require('dotenv').load();

module.exports =
    (app, client) => {
        app.get('/allMessages', (req, res) => {
            let messageId = ""
            const query = {
                text: "SELECT * FROM messages"
            }
            client.query(query, (err, result) => {
                if (err) throw (err)
                let data = []
                data.push(result)
                const query = {
                text: `SELECT * from comments`
                }
                client.query(query, (err, result) => {
                    if (err) throw (err)
                    let comments = []
                    comments.push(result)
                    console.log(comments)
                res.render('allMessages', { data: data, comments: comments })      
                })
            })
    }) 

        app.post('/addComment', (req, result) => {
            console.log("reached")
            if(req.session.user) {
            let userName = req.session.user
            let theBody  = req.body.bodyComment
            let messageId = req.body.hiddenMessageId
            let userId = req.body.hiddenUserId
            console.log("userId:", userId + "messageId", messageId, "comment: ", theBody)
            const query3 = {
            text: (`INSERT INTO comments (body, message_id, user_id) 
                    VALUES ('${theBody}', (SELECT(message_id) FROM messages WHERE message_id= '${messageId}'), (
                    SELECT (user_id) FROM users WHERE user_id= '${userId}')) RETURNING *`)
        }
        client.query(query3, (err, res) => {
            if (err) throw err
            console.log("the adding comment result: ", res.rows)
        
        const query4 = {
            text: (`SELECT body FROM comments WHERE message_id='${messageId}'`)
        }
        client.query(query4, (err, res) => {
            if (err) throw err
            let newComment = []
            newComment.push(res)
            console.log(newComment)
            result.render('allMessages', {newComment: newComment})   
            })
        })
    }
        else {
            result.send("You can only comment on a post when you are logged in")
        }
    })
    }

