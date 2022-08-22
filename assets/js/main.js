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

$(document).ready(function() {
    setTimeout(function() {
        updateSize();
       }, 100);
});

var listener = new BroadcastChannel('listener');
listener.onmessage = function (e) {
    var not = e.data;
    console.log(not);
    //console.log("mensaje del service worker " + not.data.Extras);
    console.log("mensaje del service worker " + e);

};