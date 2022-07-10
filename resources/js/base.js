function convertToBinary(input) {
    // https://stackoverflow.com/a/14430733
    let output = '';

    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2).padStart(7, '0');
    }

    return output;
}

function convertToString(input) {
    let output = input.match(/.{1,7}/g).map(binary => String.fromCharCode(parseInt(binary, 2))).join('');

    return output;
}