const fs = require('fs')
const yargs = require('yargs')
const chalk = require('chalk')

 function loadData() {
     // read file to buffer/binary data
     const buffer = fs.readFileSync("data.json")
     // stingify it
     const data = buffer.toString()
     // convert json into js object
     const dataObj = JSON.parse(data)

     return dataObj
 }

 function saveData(data) {
    fs.writeFileSync("data.json", JSON.stringify(data))
}

function addTodo(todo, status) {
    const data = loadData()
    const newTodo = { todo: todo, status: status }
    data.push(newTodo)
    saveData(data)
 }

// if(process.argv[2] === "list") {
//     console.log("Listing todos:")
    
//     const data = loadData()
    
//     data.forEach(({todo, status}) => console.log(`
//         todo: ${todo}
//         status: ${status}
//     `))

// } else if(process.argv[2] === "add") {

//     let todo = process.argv[3] || null
//     let status = process.argv[4] || false

//     if(todo) {
//         console.log("Adding a new todo to the list")

//         addTodo(todo, status)
        
//     } else {
//         console.log("Need to provide todo body")
//     }

// } else {
//     console.log("Cannot understand your command")
// }

yargs.command({
    command: "list",
    describe: "All todos",
    builder: {
        status: {
            describe: "Status of todos",
            default: "all",
            type: "string",
            alias: "s"
        }
    },

    handler: function(arg) {
        console.log("Listing todos:")

        let data = loadData()

        console.log(arg)

        if(arg.status === "all") {
            data = data

        } else if(arg.status === "done") {
            data = data.filter(el => el.status === true)

        } else if(arg.status === "not") {
            data = data.filter(el => el.status === false)
        }

        data.forEach(({ todo, status }, idx) => console.log(`
            idx: ${idx}
            todo: ${todo}
            status: ${status}
        `))
    }
})

yargs.command({
    command: "add",
    describe: "Add a new todo",
    builder: {
        todo: {
            describe: "Todo content",
            demandOption: true,
            type: "string",
            alias: "t"
        },

        status: {
            describe: "Todo status",
            demandOption: false,
            type: "boolean",
            alias: "s",
            default: false
        }
    },

    handler: function({todo, status}) {
        addTodo(todo, status)
        console.log('Added successfully')
    }
})

yargs.command({
    command: "delete",
    describe: "Delete todos",
    builder: {
        id: {
            describe: "Todo id",
            demandOption: true,
            type: "string",
            alias: "i"
        }
    },

    handler: function(arg) {
        let data = loadData()

        if(arg.id === "all") {
            data = []
            saveData(data)

        } else {
            data.splice(arg.id, 1)
            saveData(data)
        }

        console.log('Removed successfully')
    }
})

yargs.command({
    command: "toggle",
    describe: "Toggle todo",
    builder: {
        id: {
            describe: "Todo id",
            demandOption: true,
            type: "number",
            alias: "i"
        }
    },

    handler: function(arg) {
        let data = loadData()

        data[arg.id].status = !data[arg.id].status

        saveData(data) 

        console.log("Toggle complete")
    }
})

yargs.parse()