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
                text: `SELECT commentTable.commentUser, commentTable.body, commentTable.message_id FROM(SELECT comments.body, comments.message_id, users.username AS commentUser 
                        FROM comments LEFT JOIN users ON comments.user_id=users.user_id) AS commentTable`
                }
                client.query(query, (err, result) => {
                    if (err) throw (err)
                    let comments = []
                    comments.push(result)
                    res.render('allMessages', { data: data, comments: comments })    
            })
        })
    }) 

        app.post('/addComment', (req, result) => {
            console.log("reached")
            if(req.session.user) {
            let userName = req.session.user
            let theBody  = req.body.theBody
            let messageId = req.body.postId
            let userId = 0
            console.log("messageId", messageId, "comment: ", theBody)
            const query1 = {
                text: (`SELECT user_id FROM users WHERE username= '${userName}'`)
            }
            client.query(query1, (err, res) => {
                if (err) throw err   
                userId = res.rows[0].user_id
            
                const query3 = {
                text: (`INSERT INTO comments (body, message_id, user_id) 
                        VALUES ('${theBody}', (SELECT(message_id) FROM messages WHERE message_id= '${messageId}'), (
                        SELECT (user_id) FROM users WHERE user_id= '${userId}')) RETURNING *`)
                }
                client.query(query3, (err, res) => {
                    if (err) throw err
                    console.log("the adding comment result: ", res.rows)
                
                    const query4 = {
                        text: (`SELECT * FROM comments WHERE message_id='${messageId}'`)
                    }
                    client.query(query4, (err, res) => {
                        if (err) throw err
                        let newComment = []
                        for(var i=0; i < res.rows.length; i++){
                            console.log(res.rows.length)
                        console.log("Reached: deze comment ")
                        newComment.push(res.rows)
                        console.log(newComment + "dit is de nieuwe comment")
                        result.end('allMessages', {data: newComment})
                        } 
                    })
                })
            })
        }
            else {
            result.send("You can only comment on a post when you are logged in")
        }
    })
}

