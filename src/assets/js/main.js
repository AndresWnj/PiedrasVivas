window.onresize = function() {
    updateSize();
}

var update=true;

$("body").on('DOMSubtreeModified', ".txtDescripcion", function() {
    updateSize();
});

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

var listener = new BroadcastChannel('listener');
listener.onmessage = function (e) {
    var not = e.data;
    console.log("mensaje del service worker " + e);
    console.log(not);
    $(".txtPasaje").html("<span>"+e.data.notification.title+"</span>");
    $(".txtDescripcion").html("<span>"+e.data.notification.body+"</span>");
    $(".back").attr("src","./app/../assets/images/i"+getRandomInt(1, 5)+"_landscape.png");
};
