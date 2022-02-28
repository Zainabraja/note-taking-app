const fs = require('fs')
const yargs = require('yargs')
const chalk = require("chalk");

var myObject;
var args = process.argv

if (fs.existsSync("notes.json")) {
    var data = fs.readFileSync("notes.json");
    myObject = JSON.parse(data);
} else {
    fs.open("notes.json", "w", (err) => {
        if (err) throw err;
    })
    myObject = []
}

yargs
    // Add command
    .command({
        command: 'add',
        describe: 'Adds note to the list',
        builder: {
            title: {
                describe: 'Title',
                demandOption: true,
                type: 'string'
            },
            body: {
                describe: 'Body',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            if (args.length > 5) {
                console.log(chalk.red("Length of arguments is more than expected!"))
                if (myObject.length == 0) {
                    fs.unlinkSync("notes.json")
                }
            } else {
                var cnt = 0
                for (var i = 0; i < myObject.length; i++) {
                    if (myObject[i].title == argv.title) {
                        console.log(chalk.red("Title already taken!"))
                        cnt = 1
                        break;
                    }
                }
                if ((i == myObject.length) && (cnt == 0)) {
                    var note = { "title": argv.title, "body": argv.body }
                    myObject.push(note)

                    var newData = JSON.stringify(myObject);
                    fs.writeFile("notes.json", newData, (err) => {
                        if (err) throw err;
                        console.log(chalk.bgGreenBright.black("New note created!"));
                    });
                }
            }
        }
    })
    // Remove command
    .command({
        command: 'remove',
        describe: 'Removes a note from the list',
        builder: {
            title: {
                describe: 'Title',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            if (args.length > 4) {
                console.log(chalk.red("Length of arguments is more than expected!"))
                if (myObject.length == 0) {
                    fs.unlinkSync("notes.json")
                }
            } else {
                var cnt = 0
                for (var i = 0; i < myObject.length; i++) {
                    if (myObject[i].title == argv.title) {
                        myObject.splice(i, 1)
                        cnt = 1
                    }
                }
                if ((i == myObject.length) && (cnt == 0)) {
                    console.log(chalk.red("Note not found!"))
                }
                else {
                    var updated = JSON.stringify(myObject);
                    fs.writeFile("notes.json", updated, (err) => {
                        if (err) throw err;
                        console.log(chalk.bgCyan.black("Note removed!"));
                    });
                }
            }
        }
    })
    // List command
    .command({
        command: 'list',
        describe: 'Show all the notes',
        handler(argv) {
            if (myObject.length == 0) {
                fs.unlinkSync("notes.json")
            }
            else if (args.length > 3) {
                console.log(chalk.red("List command does not take any arguments!"))
                if (myObject.length == 0) {
                    fs.unlinkSync("notes.json")
                }
            } else {
                console.log(chalk.bgBlue.black("Your Notes:"))
                for (var i = 0; i < myObject.length; i++) {
                    console.log(myObject[i].title)
                }
            }
        }
    })
    // Read command
    .command({
        command: 'read',
        describe: 'Show all the notes',
        builder: {
            title: {
                describe: 'Title',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            if (myObject.length == 0) {
                fs.unlinkSync("notes.json")
            }
            else if (args.length > 4) {
                console.log(chalk.red("You can read only 1 note at a time!"))
                if (myObject.length == 0) {
                    fs.unlinkSync("notes.json")
                }
            } else {
                var cnt = 0
                for (var i = 0; i < myObject.length; i++) {
                    if (myObject[i].title == argv.title) {
                        cnt = 1
                    }
                }
                if ((i == myObject.length) && (cnt == 0)) {
                    console.log(chalk.red("Note not found!"))
                }
                else {
                    console.log(chalk.bgYellow.black(`${argv.title}`))
                    for (var i = 0; i < myObject.length; i++) {
                        if (myObject[i].title == argv.title) {
                            console.log(`${myObject[i].body}`)
                        }
                    }
                }
            }
        }
    })

yargs.parse()