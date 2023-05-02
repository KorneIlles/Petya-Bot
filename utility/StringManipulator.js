function randomColorHexCodeGenerator() {
    // Generate a random number between 0 and 16777215 (0xFFFFFF)
    const randomNumber = Math.floor(Math.random() * 16777215);
    // Convert the number to a hex string and pad it with zeros if necessary
    const hexString = randomNumber.toString(16).padStart(6, '0');
    // Prepend a hash symbol (#) to the hex string to create a valid CSS color code
    // Return the hex code
    return hexString;
}

function stringManipulator(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    capitalizeTheString: stringManipulator,
    randomColorHexCodeGenerator:randomColorHexCodeGenerator
}