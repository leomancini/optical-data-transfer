window.onload = function() {
    initialize();
};

function initialize() {
    let input = document.querySelector('textarea');
    let transmitter = document.querySelector('#transmitter');
    let transmitterPreview = transmitter.querySelector('#preview');
    let transmitterOptical = transmitter.querySelector('#optical');

    document.querySelector('button#preview').onclick = (e) => {
        let binary = convertToBinary(input.value);

        transmitterOptical.classList.remove('visible');
        transmitterPreview.innerText = `Binary:\n\n${binary}\n\n\n\nString:\n\n${convertToString(binary)}`;
    }

    document.querySelector('button#transmit').onclick = (e) => {
        let binary = convertToBinary(input.value);

        transmitterOptical.classList.add('visible');
        transmitterPreview.innerText = '';

        let i = 0;
        let data = binary.split('');
        let speed = 100;

        let transmitInterval = setInterval(function() {
            if (i < data.length) {
                let code = data[i];
                if (code === '0') {
                    transmitterOptical.style.background = 'white';
                } else {
                    transmitterOptical.style.background = 'black';
                }
                i++;
            } else {
                clearInterval(transmitInterval);
                console.log('Finished transmitting!');
                transmitterOptical.classList.remove('visible');
                transmitterPreview.innerText = `FINISHED TRANSMITTING`;
            }
        }, speed);
    }
}