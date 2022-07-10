var frameSpeed = window.config.frameSpeed;
var expectedFrameSpeed = Date.now() + frameSpeed;

var cameraSize;
var consoleView = document.querySelector('#console');
var consoleViewBinary = consoleView.querySelector('#console #binary');
var consoleViewString = consoleView.querySelector('#console #string');

window.onload = function() {
    initialize();
};

function initialize() {

    if (window.innerWidth < 890) {
        cameraSize = window.innerWidth - 80; 
    } else {
        cameraSize = 512;
    }

    window.params = {
        size: cameraSize,
        frameRate: 60
    };

    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {
                width: window.params.size,
                height: window.params.size,
                audio: false,
                facingMode: 'environment'
            }
        }).then(function(stream) {
            let video = document.querySelector('video');

            video.srcObject = stream;
            video.onloadedmetadata = function() { video.play(); };

            let canvas = document.querySelector('canvas#sensor');
            canvas.width = window.params.size;
            canvas.height = window.params.size;

            let context = canvas.getContext('2d');

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            video.addEventListener('play', function() {
                context.drawImage(this, 0, 0, canvas.width, canvas.height);

                setTimeout(getFrame, frameSpeed, { video, canvas, context });
            }, false);
        }).catch(function(error) {
            alert(error);
        });
    }

    document.querySelector('button#toggle-sensor').onclick = (e) => {
        if (window.readFromSensor) {
            e.target.innerText = 'Start Sensor';
            clearInterval(window.repeatedlyParseIncomingData);
            consoleViewString.innerText = '';
            consoleViewBinary.innerText = '';
            window.readFromSensor = false;
        } else {
            window.repeatedlyParseIncomingData = setInterval(parseIncomingData, 1000);
            e.target.innerText = 'Stop Sensor';
            window.readFromSensor = true;
        }
    }
}

function getSensorData(canvas, context) {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let rgba = imageData.data;

    // Based on https://stackoverflow.com/a/13763063
    for (var px = 0, ct = canvas.width * canvas.height * 4; px < ct; px += 4) {
        var r = rgba[px];
        var g = rgba[px+1];
        var b = rgba[px+2];
        var a = rgba[px+3];
    }

    // let grey = Math.round((r + g + b) / 3);

    if (r > 200 && g < 200 & b < 200) {
        return 0;
    } else if (r < 200 && g < 200 & b > 200) {
        return 1;
    }
}

function writeDataToConsoleView(sensorData) {
    if (sensorData === 0 || sensorData === 1) {
        consoleViewBinary.innerText += sensorData;
    }
}

function drawSensorPreview(video, canvas, context) {
    // Based on https://nathanwillson.com/blog/posts/conway/
    let resolution = 1;
    let zoom = 100;

    context.drawImage(video, 0, 0, resolution, resolution);
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.drawImage(canvas, 0, 0, resolution, resolution, (window.params.size / 2) - ((canvas.width * zoom) / 2), (window.params.size / 2) - ((canvas.height * zoom) / 2), canvas.width * zoom, canvas.height * zoom);
}

function getFrame(params) {
    var drift = Date.now() - expectedFrameSpeed;
    if (drift > frameSpeed) {
        // Clock got out of sync
    }

    readDataFromVideo(params.video, params.canvas, params.context);

    expectedFrameSpeed += frameSpeed;
    setTimeout(getFrame, Math.max(0, frameSpeed - drift), { video: params.video, canvas: params.canvas, context: params.context });
}

function readDataFromVideo(video, canvas, context) {
    drawSensorPreview(video, canvas, context);
    let sensorData = getSensorData(canvas, context);

    if (window.readFromSensor) {
        writeDataToConsoleView(sensorData);
    }
}

function parseIncomingData() {
    let binary = consoleViewBinary.innerText;
    let string = convertToString(binary);

    consoleViewString.innerText = string;
}