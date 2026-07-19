const express = require("express")
const fs = require("fs")
const users = require("./MOCK_DATA.json")

const app = express()
const port = 3000
const fileName = "./MOCK_DATA.json"

// Middlewares
app.use(express.urlencoded({ extended:false }))

// Routes that returns JSON format data
app.get("/api/users", (req, res) => {
    // Returns all the users in JSON
    return res.json(users)
})

app.route("/api/users/:id")
    .get( (req, res) => {
        // Return a user with id
        let id = Number (req.params.id)
        let user = users.find(user => user.id === id)

        if (user) {
            res.json(user)
        } else {
            res.json({"Status" : "User doesn't exist", id})
        }
    })
    .patch((req, res) => {
        // Edit user with id
        let id = Number (req.params.id)
        let data_body = req.body
        let user = users.find(u => u.id === id)
        if (user) {
            Object.assign(user, { id }, data_body) // Updating the user with new data from frontend in data_body
            fs.writeFile(fileName, JSON.stringify(users), (err, data) => {
                if (err) {
                    console.error("File write error:", err);
                    return res.status(500).json({ "Status": "Failed to write file", error: err.message });
                }
                return res.json({"Status" : "Successfully updated user", id})
            })
        } else {
            res.json({"Status" : "Failed to update user", id})
        }
    })
    .delete((req, res) => {
        // Delete user with id
        let id = Number (req.params.id)
        let index = users.findIndex(user => user.id === id)
        
        if (index != -1) {
            users.splice(index, 1)
            fs.writeFile(fileName, JSON.stringify(users), (err, data) => {
                if (err) {
                    console.error("File write error:", err);
                    return res.status(500).json({ "Status": "Failed to write file", error: err.message });
                }
                return res.json({"Status" : `Successfully deleted user`, id})
            })
        } else {
            return res.json({"Status" : `User doesn't exist`, id})
        }
    })

app.post("/api/users", (req, res) => {
    // Add a new user
    let data_body = req.body
    if (users.find(user => user.email === data_body.email)) {
        return res.json({"Status" : "User is already present, please try with different email."})
    }
    else {
        users.push({id: users[users.length-1].id + 1, ...data_body})
        fs.writeFile(fileName, JSON.stringify(users), (err, data) => {
            return res.json({"Status" : "Successfully added new user", "Id" : users[users.length-1].id})
        })
    }
})


// Route that returns HTML-Doc data
app.get("/users", (req, res) => {
    let html = `
        <ul>
            ${users.map((users) => `<li>${users.first_name}  -  ${users.job_title}</li>`).join("")}
        </ul>
    `
    res.send(html)
})

app.listen(port, (req, res) => {
    console.log(`Server is listening on: http://localhost:${port}`)
})