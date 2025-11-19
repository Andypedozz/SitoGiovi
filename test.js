import readline from "readline"

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
})

rl.question("Insert string: ", (text) => {
    console.log(text)
    rl.close()
})