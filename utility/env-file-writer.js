const dotenv = require('dotenv');
const { promisify } = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);


async function rewriteEnvFile(){
    const result = dotenv.config(); // Load environmental variables from .env file
    
    if (result.error) {
    // Handle error
    console.error(result.error);
    } else {
    // Determine which variables were set from the .env file
    const { parsed } = result;
    const setFromEnvFile = Object.keys(parsed); //get all key from .env file
    
    await writeFile('.env', setFromEnvFile.map(key => `${key}=${process.env[key]}`).join('\n')); //write back new env variables to .env file
}
}

module.exports = {
    rewriteEnvFile
}