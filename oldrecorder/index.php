<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">

    <title>Vault of Us MP3 Recorder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Latest compiled and minified Bootstrap CSS -->
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&ampdisplay=swap" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="styles.css">
</head>

<body>

   

    <div class="border border-5" style="max-width: 336px;">
        <h3>Recorder</h3>
        <div id="controls">
            <button id="recordButton">Record</button>
            <button id="stopButton" disabled>Stop</button>
        </div>
        <div id="stopwatch">

        </div>
        <div id="recordingsList">
            
        </div>
    </div>

    <!-- inserting these scripts at the end to be able to use all the elements in the DOM -->
    <script src="oldrecorder/js/WebAudioRecorder.min.js"></script>
    <script src="oldrecorder/js/app.js"></script>

</body>

</html>