window.onload = function() {
    initialize();
};

function initialize() {
    let input = document.querySelector('textarea');
    let transmitter = document.querySelector('#transmitter');

    document.querySelector('button#preview-transmission').onclick = (e) => {
        let binary = convertToBinary(input.value);

        transmitter.innerText = `Binary:\n\n${binary}\n\n\n\nString:\n\n${convertToString(binary)}`
    }
}
function convertToBinary(input) {
    // https://stackoverflow.com/a/14430733
    let output = '';

    for (var i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2).padStart(7, '0');
    }

    return output;
}

function convertToString(input) {
    let output = input
    .match(/.{1,7}/g)
    .map(bin => String.fromCharCode(parseInt(bin, 2)))
    .join('');

    return output;
}