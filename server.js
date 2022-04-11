const express = require("express")
const app = express()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

const port = argv["port"] || 5000

function coinFlip() {
    var min = 1
    var max = 2
    var randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
    if (randomNumber == 1) {
        return "heads"
    } else {
        return "tails"
    }
}

function coinFlips(flips) {
    var flipsArray = []
    for (var i = 0; i < flips; i++) {
        flipsArray.push(coinFlip())
    }
    return flipsArray;

}

function countFlips(array) {
    var flipCount = {}
    for (var i = 0; i < array.length; i++) {
        var flipResult = array[i]
        if (!flipCount[flipResult]) {
            flipCount[flipResult] = 0
        }
        flipCount[flipResult] += 1
    }
    return flipCount

}

function flipACoin(call) {
    var flipResult = coinFlip()
    if (flipResult != call) {
        return { call: call, flip: flipResult, result: "lose" }
    } else {
        return { call: call, flip: flipResult, result: "win" }
    }
}

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get("/app/", (req,res) => {
    res.statusCode = 200
    res.statusMessage = "ok"
    res.writeHead(res.statusCode, {"Content-Type": "text/plain"})
    res.end(res.statusCode + " " + res.statusMessage)
})

app.get("/app/flip/", (req, res) => {
    var flip = coinFlip()
    return res.status(200).json({"flip" : flip})
})

app.get("/app/flips/:number", (req, res) => {
    var numFlips = req.params.number
    var flipResults = coinFlips(numFlips)
    var summary = countFlips(flipResults)
    return res.status(200).json({"raw" : flipResults, "summary": summary})
})

app.get("/app/flip/call/heads", (req, res) => {
    return res.status(200).json(flipACoin("heads"))
})

app.get("/app/flip/call/tails", (req,res) => {
    return res.status(200).json(flipACoin("tails"))
})
app.use(function(req,res){
    res.status(404).send("404 NOT FOUND")
})
