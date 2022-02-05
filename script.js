const button = document.getElementsByClassName('btn');
const theme = localStorage.getItem('data-theme');
const input = document.querySelectorAll('input');
const label = document.querySelector('.label');
const audio = document.querySelector('audio');
const thumb = document.querySelector('img');
const body = document.body.classList;
const array = []; // id storage
const interval = setInterval(script, 2000);

let y; // store id
let m; // queue count 
let n = 1; // current queue playing
let c = 249; // quality value
let q = "low"; // quality boolean
let queue = false; // queue boolean
let error = "NotAllowedError: Read permission denied.";


if (navigator.userAgent.indexOf('Firefox') != -1) {
  input[0].classList.remove('d-none');
  alert('Clipboard API Not Supported : Some Functions Might Not Work');
  clearInterval(interval);
}


function atsrc(x) {
  //Playback
  audio.src = "https://projectlounge.pw/ytdl/download?url=https://youtu.be/" + x + "&format=" + c;
  audio.play();
  //Thumbnail
  thumb.src = "https://img.youtube.com/vi/" + x + "/maxresdefault.jpg";
  y = x;
}

// save hq setting
if (localStorage.getItem('format') == "yes") {
  input[4].checked = true;
  c = 251;
  q = "high";
}


function script() {
  navigator.clipboard.readText().then(link => {
    //UID Extractor
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    let id = link.match(re)[7];
    // HQ 128kbps
    if (input[4].checked == true && q == "low") {
      c = 251;
      atsrc(id);
      q = "high";
      localStorage.setItem('format', "yes");
    }
    else if (input[4].checked == false && q == "high") {
      c = 249;
      atsrc(id);
      q = "low";
      localStorage.setItem('format', "no");
    }
    //initial id value
    if (y == undefined) { atsrc(id); }
    //start playing if new id
    else if (y != id && queue == false) { atsrc(id); }
    // queue new id
    else if (y != id && queue == true) {
      m++;
      label.innerText = m - n + 1;
      array[m] = y = id;
      audio.onended = (e) => {
        atsrc(array[n]);
        label.innerText = m - n;
        n++;
      }
    }
  }).catch(err => {
    // maybe user didn't grant access to read from clipboard
    if (err == error) {
      error = true;
      input[0].classList.remove('d-none');
      alert('Permissions Denied : Some Functions Might Not Work');
      clearInterval(interval);
    }
  });
}

// input text player
input[0].addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    let id = input[0].value.match(re)[7];
    atsrc(id);
  }
});

// rewind & forward
button[0].addEventListener("click", function() {
  audio.currentTime += -10;
})
button[1].addEventListener("click", function() {
  audio.currentTime += 10;
})
// next track
button[3].addEventListener("click", function() {
  atsrc(array[n]);
  label.innerText = m - n;
  n++;
});
// store new id in queue
button[2].addEventListener("click", function() {
  script();
});

// Queue Loop Auto Save

if (localStorage.getItem('play') == "loop") {
  audio.onended = (e) => {
    audio.play();
  };
  input[2].checked = true;
}
else if (localStorage.getItem('play') == "queue") {
  m = 0;
  queue = true;
  clearInterval(interval);
  script();
  input[1].checked = true;
  button[2].classList.remove('d-none');
  button[3].classList.remove('d-none');
  label.classList.remove('d-none');
}
else {
  audio.onended = null;
  localStorage.setItem('play', "auto");
  input[3].checked = true;
}

// queue

input[1].addEventListener("click", function() {
  m = 0;
  queue = true;
  clearInterval(interval);
  script();
  button[2].classList.remove('d-none');
  button[3].classList.remove('d-none');
  label.classList.remove('d-none');
  localStorage.setItem('play', "queue");
});

//Loop

input[2].addEventListener("click", function() {
  audio.onended = (e) => {
    audio.play();
  };
  localStorage.setItem('play', "loop");
  location.reload();
});

// auto
input[3].addEventListener("click", function() {
  localStorage.setItem('play', "auto");
  location.reload();
});


// Dark Mode

if (theme == "dark") {
  body.remove('bg-secondary');
  body.add('bg-dark');
}
input[5].checked = theme == "dark" ? true : false;
input[5].onchange = function() {
  if (this.checked) {
    body.remove('bg-secondary');
    body.add('bg-dark');
    window.localStorage.setItem('data-theme', "dark");
  } else {
    body.add('bg-secondary');
    body.remove('bg-dark');
    window.localStorage.setItem('data-theme', "secondary");
  }
}

// clear settings
button[4].addEventListener("click", function()
{
  localStorage.clear();
  location.reload();
});

// alert
button[6].addEventListener("click", function() {
  alert('YTIFY 2j\n\nCopy YouTube video link to clipboard to start playing automatically.\n\nBack & Forward : Rewind or Fast Forward 10 seconds.\n\nQueue: Click Queue & Add Next Playing links.\n\nNext: Skip to next track in queue.\n\nLoop: Set your track to be playing in a loop.\n\nAuto: Automatically intercept & play links.\n\nHQ 128kbps: Set audio quality to higher, costs 1MB per Minute.\n\nDelete: Clear all saved data.\n\nGithub: Fork this site and help improve.');
});