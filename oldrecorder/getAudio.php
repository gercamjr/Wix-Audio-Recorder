<?php
include('config.php');  
    $sql = 'select * from audio_recordings order by date_created desc limit 1';
    $result = mysqli_query($con, $sql);
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);
    } else {
        echo 'No audio recording found';
    }
    mysqli_close($con);

?>