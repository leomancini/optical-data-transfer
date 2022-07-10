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

        var frameSpeed = window.config.frameSpeed;
        var expectedFrameSpeed = Date.now() + frameSpeed;

        setTimeout(sendFrame, frameSpeed, data);

        function sendFrame(data) {
            // https://stackoverflow.com/a/29972322
            let drift = Date.now() - expectedFrameSpeed; 
            if (drift > frameSpeed) {
                // Clock got out of sync
            }

            if (i < data.length) {
                let code = data[i];
                if (code === '0') {
                    transmitterOptical.style.background = 'red';
                } else {
                    transmitterOptical.style.background = 'blue';
                }
                i++;

                expectedFrameSpeed += frameSpeed;
                setTimeout(sendFrame, Math.max(0, frameSpeed - drift), data);
            } else {
                console.log('Finished transmitting!');
                transmitterOptical.classList.remove('visible');
                transmitterPreview.innerText = `FINISHED TRANSMITTING`;
            }
        }
    }
}