const express = require('express')
const fs = require('fs')
const users = require("./MOCK_DATA.json")

const app = express()
const port = 3000

app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))
app.use(express.json())

// RAW JSON Data on /api/...
app.route("/api/users")
    .get((req, res) => {
        // const users2 = fs.readFile('./MOCK_DATA.json')
        console.log("Body: ", req.query)
        res.json(users)
    })
    .post((req, res) => {
        let email = req.body.email
        let body = {
            "first_name": req.body.first_name,
            "email": email,
            "gender": req.body.gender,
            "city": req.body.city
        }
        const newID = users.length + 1
        if (users.forEach((user) => {
            if (user.email === email) {
                return res.send(`The user with ${email} is already present`)
            }
        }))
        users.push({id: newID, ...body})
        console.log("A new User with Id: " + newID + " is added to data.")
        
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            console.log(err)
        })

        res.send(`User added successfully\nId: ${newID}`)
    })

app.delete("/api/users/deleteALL", (req, res) => {
    if (req.body.karu === "1") {
        users.length = 0
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) console.log("Error: ", err)
        })
        console.log("All data has been deleted!")
        return res.send("All the users are deleted")
    }
    res.send("Ok, no Deletion has done!")
})
    

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number (req.params.id)
        res.send(users.find(user => user.id === id))
    })
    .patch((req, res) => {
        const id = Number (req.params.id)

        users.forEach((user) => {
            if (user.id === id) {
                user.first_name = req.body.first_name
                user.email = req.body.email
                user.gender = req.body.gender
                user.city = req.body.city
            } else {
                res.send(`The with Id: ${id} dosn't exist`)
            }
        })
        
        res.send("Successfully edited the user with ID: <br>" + id + "</br> PATCH - edit")
    })
    .delete((req, res) => {
        const id = Number (req.params.id)
        let userName = users.filter(user => {
            if (user.id === id) return user.first_name
        })
        let optString = `The user ${userName} with ID: ${id} has been deleted successfully!`

        users = users.filter(user => user.id !== id)
        console.log(optString)

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            console.log(err)
        })

        res.send(`${optString}\nDELETE`)
    })


// HTML Doc Data on /users/...
app.route("/users")
    .get((req, res) => {
        let html = `<ul>
            ${users.map((user) => {
                return `<li>${user.first_name}</li>`
            }).join("")}
        </ul>`
        console.log("Total users: " + users.length)
        res.send(html)
    })


app.listen(port, (req, res) => {
    console.log(`Server is on: http://localhost:${port}/users`)
})