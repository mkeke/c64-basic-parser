// convert from txt to basic
const fs = require("fs");
const log = (str) => { console.log(str); }

// define default params
const params = {
    help: false,
    watch: false,
    filename: false,
}

if (!verifyParams()) {
    return;
}
convert();

if(params.watch) {
    log("watching file");
    watchFile();
}



function convert() {
    log("Converting " + params.filename);

    // read source file into array
    let sourceFile = fs.readFileSync(params.filename, "utf8").split("\n");

    let code = [];
    let lineNumber = 10;
    for(let i=0; i<sourceFile.length; i++) {
        let line = sourceFile[i];

        // remove whitespace on both sides of line
        line = line.replace(/^\s+|\s+$/g, "");

        if (line != "") {
            code.push(lineNumber + " " + line);
            lineNumber += 5;
        }
    }

    // create line numbers. output
    for (i in code) {
        log(code[i]);
    }

}

/*
    watchWile
    Watch file for changes, and trigger convert()
*/
function watchFile() {
    let fsWait = false;
    fs.watch(params.filename, (event, filename) => {
        if (filename) {
            if (fsWait) {
                return;
            }
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 100);

            log("File changed");
            convert();
        }
    });
}

/*
    verifyParams
    Verify correct params and existing file
*/
function verifyParams() {
    // gather params
    for(let i=0; i<process.argv.length; i++) {
        let param = process.argv[i];
        switch(param) {
            case "-h":
            case "-help":
                params.help = true;
                break;
            case "-w":
            case "-watch":
                params.watch = true;
                break;
        }
    }
    params.filename = process.argv[process.argv.length-1];

    if (params.help) {
        log("usage:\n  node z.basic.js [-w|-watch] [-h|-help] <filename>");
        return false;
    }

    if (!fs.existsSync(params.filename)) {
        log("file not found or not specified.")
        return false;
    }

    return true;
}
