import * as fs from "fs";

const packageJSON = require('./package.json');

// write-out version file
fs.writeFileSync('./static/version.json', JSON.stringify({
    version: packageJSON.version
}));