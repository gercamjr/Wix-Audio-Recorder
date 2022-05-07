//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

const timer = document.getElementById('stopwatch');

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

var gumStream; //stream from getUserMedia()
var recorder; //WebAudioRecorder object
var input; //MediaStreamAudioSourceNode  we'll be recording
var encodingType; //holds selected encoding for resulting audio (file)
var encodeAfterRecord = true; // when to encode
const canvas = document.querySelector('.visualizer');

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

//const canvasCtx = canvas.getContext('2d');

function startRecording() {
    console.log("startRecording() called");

    /*
    	Simple constraints object, for more advanced features see
    	https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video: false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {


        /*
        	create an audio context after getUserMedia is called
        	sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
        	the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();
        //assign to gumStream for later use
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        //stop the input from playing back through the speakers
        //input.connect(audioContext.destination)

        //get the encoding 
        encodingType = "mp3";

        //disable the encoding selector

        startTimer();
        recorder = new WebAudioRecorder(input, {
            workerDir: "js/", // must end with slash
            encoding: encodingType,
            numChannels: 2, //2 is the default, mp3 encoding supports only 2
            onEncoderLoading: function(recorder, encoding) {
                // show "loading encoder..." display

            },
            onEncoderLoaded: function(recorder, encoding) {
                // hide "loading encoder..." display

            }
        });

        recorder.onComplete = function(recorder, blob) {

            createDownloadLink(blob, recorder.encoding);

        }

        recorder.setOptions({
            timeLimit: 600,
            encodeAfterRecord: encodeAfterRecord,
            ogg: { quality: 0.5 },
            mp3: { bitRate: 128 }
        });


        //start the recording process
        recorder.startRecording();


    }).catch(function(err) {
        //enable the record button if getUSerMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;

    });

    //disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
    console.log("stopRecording() called");
    stopTimer();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //disable the stop button
    stopButton.disabled = true;
    recordButton.disabled = false;

    //tell the recorder to finish the recording (stop recording + encode the recorded audio)
    recorder.finishRecording();

}

function createDownloadLink(blob, encoding) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('div');
    var link = document.createElement('a');
    var deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('deleteBtn');

    deleteButton.innerHTML = "Delete";

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //link the a element to the blob
    link.href = url;
    link.download = 'Vault of Us Recording_' + new Date().toISOString() + '.' + encoding;
    link.innerHTML = "<button id='save-btn' class='btn'>Save Audio</button>";

    //add the new audio and a elements to the li element
    li.appendChild(au);
    li.appendChild(deleteButton);
    li.appendChild(link);

    //add the li element to the ordered list
    recordingsList.appendChild(li);
    recordButton.disabled = true;
    deleteButton.onclick = function(e) {
        resetTimer();
        recordButton.disabled = false;
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    }
}




function startTimer() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}

function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        sec = sec + 1;

        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
        }
        if (hr < 10 || hr == 0) {
            hr = '0' + hr;
        }

        timer.innerHTML = hr + ':' + min + ':' + sec;

        setTimeout("timerCycle()", 1000);
    }
}

function resetTimer() {
    timer.innerHTML = "00:00:00";
    stoptime = true;
    hr = 0;
    sec = 0;
    min = 0;
}