window.onresize = function() {
    updateSize();
    /*if(!isNotFullScreen()){
        $(".btnFullScreen").hide();
    }else{
        $(".btnFullScreen").show();
    }*/
}

var update=true;

/*$("body").on('DOMSubtreeModified', ".txtDescripcion", function() {
    updateSize();
});*/

$("body").on('click', ".btnFullScreen", function() {
    $(".btnFullScreen").hide();
    toggleFullScreenMode();
});

function toggleFullScreenMode() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl['requestFullscreen'] || docEl['mozRequestFullScreen'] || docEl['webkitRequestFullScreen'] || docEl['msRequestFullscreen'];
    var cancelFullScreen = doc['exitFullscreen'] || doc['mozCancelFullScreen'] || doc['webkitExitFullscreen'] || doc['msExitFullscreen'];
  
    if(!doc['fullscreenElement'] && !doc['mozFullScreenElement'] && !doc['webkitFullscreenElement'] && !doc['msFullscreenElement']) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
}

function isNotFullScreen(){
    return !doc['fullscreenElement'] && !doc['mozFullScreenElement'] && !doc['webkitFullscreenElement'] && !doc['msFullscreenElement'];
}

function updateSize(){
    if(update){
        update=false;
        $('.txtDescripcion').textfill({
            maxFontPixels: 500
        });
    
        $('.txtPasaje').textfill({
            maxFontPixels: 500
        });
    }
    update=true;
}

/*$(document).ready(function() {
    setTimeout(function() {
        updateSize();
       }, 100);
});*/

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var lastPasaje="";
var listener = new BroadcastChannel('listener');
listener.onmessage = function (e) {
    var newPasaje=e.data.notification.title+e.data.notification.body;
    if(newPasaje!==lastPasaje){
        lastPasaje=newPasaje;
        console.log("mensaje del service worker ");
        console.log(e.data);

        if(e.data.notification.title===" "){
            $(".txtDescripcion").css('text-align', "center");
            $(".txtPasaje").css('height', "0%");
            $(".txtDescripcion").css('height', "100%");
        }else{
            $(".txtDescripcion").css('text-align', "left");
            $(".txtPasaje").css('height', "12%");
            $(".txtDescripcion").css('height', "88%");
        }
        $(".txtPasaje").html("<span>"+e.data.notification.title+"</span>");
        $(".txtDescripcion").html("<span>"+e.data.notification.body+"</span>");
        updateSize();
        $(".back").attr("src","./app/../assets/images/i"+getRandomInt(1, 5)+"_landscape.png");
    }
};

