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
var deleteButton = document.getElementById('deleteButton');
const micSVG = document.getElementById("micIcon");

const recordingsList = document.getElementById('recordingsList')
const saveButtonWrapper = document.querySelector('.recorder__controls--save')


//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
stopButton.disabled = true;
stopButton.style.cursor = "not-allowed";
deleteButton.disabled = true;


//const canvasCtx = canvas.getContext('2d');

function startRecording() {
    console.log("startRecording() called");
    micSVG.style.fill = "#ff4040";
    recordButton.style.backgroundColor = "transparent";
    recordButton.style.cursor = "not-allowed";
    

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
        console.log("we could not get the user media! " + err.message);
        recordButton.disabled = false;
        stopButton.disabled = true;

    });

    //disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
    stopButton.style.cursor = "pointer";
    stopButton.style.backgroundColor = "#ff4040";
    stopButton.style.color = "#fff";
    
}

function stopRecording() {
    console.log("stopRecording() called");
    stopTimer();
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    
    deleteButton.disabled = false;
    saveButtonWrapper.style.display = 'flex'
    saveButtonWrapper.style.flexDirection = 'column'
    saveButtonWrapper.style.alignItems = 'center'
    //disable the stop button
    stopButton.disabled = true;
    recordButton.disabled = false;
    
    recordButton.style.cursor = "pointer";
    stopButton.style.cursor = "not-allowed";
    stopButton.style.backgroundColor = "#000";
    stopButton.style.color = "#fff"
    recordButton.style.backgroundColor = "#ff4040";
    micSVG.style.fill = "#fff";
    recordButton.style.display = "none"
    stopButton.style.display = 'none'
    document.querySelector('.text__record').style.display = 'none'
    document.querySelector('.text__stop').style.display = 'none'
    document.querySelector('.text__redo').style.display = 'block'
    deleteButton.style.display = "block"

    //tell the recorder to finish the recording (stop recording + encode the recorded audio)
    recorder.finishRecording();

}

function createDownloadLink(blob, encoding) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    //var link = document.createElement('a');
    //var li = document.createElement('div')
    
    const saveDiv = document.getElementById('saveAudio');
    const saveButton = document.getElementById('saveButton')

    const audioURL =  document.getElementById('audioURL')
                
    // deleteButton.classList.add('btn');
    // deleteButton.classList.add('deleteBtn');

    //deleteButton.innerHTML = "Delete";

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;
    au.classList.add('recorder__player--audio');

    //link the a element to the blob
    // link.href = url;

    
    //link.download = 'Vault of Us Recording_' + new Date().toISOString() + '.mp3';
    //link.innerHTML = "<button id='save-btn' class='recorder__save--btn'>Save Audio</button>";

    //add the new audio and a elements to the li element
    // li.appendChild(au);
    // li.appendChild(deleteButton);
    // li.appendChild(link);


    //add the li element to the ordered list
    recordingsList.appendChild(au);
    
    recordButton.disabled = true;

    saveButton.onclick = function(e) {
        const formData = new FormData();
        formData.append('audio',blob);
        formData.append('name', new Date().toISOString() + '.' + encoding)
        const saveText = document.querySelector('.text__save')
        saveButton.style.backgroundColor = 'gray'
        saveText.innerHTML = 'Saving...'
        fetch('/saveAudio.php', {
            method: 'POST',
            body: formData
            
        }).then(response => {
            saveText.innerHTML = 'Saved!'
            saveButton.style.backgroundColor = '#ffd677'
            deleteButton.parentElement.style.display = 'none'
            return response.text().then(function(text) {
                
                document.querySelector('div.recorder').style.display = 'none'
            
                audioURL.textContent = text

                document.querySelector('.the__end').style.display = 'flex'

                
            })
            
        })
        .catch(err => alert(err))


        
    }

}


deleteButton.onclick = function(e) {
    


    resetTimer();
    recordButton.disabled = false;
    saveButtonWrapper.style.display = 'none'
    recordButton.style.backgroundColor = "#ff4040";
    micSVG.style.fill = "#fff";
    
    document.querySelector('.text__stop').style.display = 'block'
    document.querySelector('.text__record').style.display = 'block'
    document.querySelector('.text__redo').style.display = 'none'

    
    recordButton.style.display = 'block'
    stopButton.style.display = 'block'
    deleteButton.style.display = 'none'
    document.getElementById('recordingsList').removeChild(document.querySelector('audio'))
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