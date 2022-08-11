<?php
include('config.php');
    $file_name = $_POST['name'];

    $target_path = dirname(__FILE__) . "/upload/{$file_name}";
    $dateCreated = date("Y-m-d H:i:s");
    $audioURL = 'https://legacyrecorder.org/upload/'.$file_name;

    if(move_uploaded_file($_FILES['audio']['tmp_name'], $target_path)) {
        mysqli_query($con, "insert into `audio_recordings` (url, date_created) values ('https://legacyrecorder.org/upload/".$file_name."', '".$dateCreated."')");
        mysqli_close($con);
        echo $audioURL;
    }
?>