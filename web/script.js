var db = firebase.database()
var ref = db.ref();

var slider = $('#ex1').slider()

$("#ex1").on("change", function(ev) {
	var value = ev.value.newValue
	ref.update({"/sphere1/scale": value})
});
                      
ref.on("value", function(snapshot){
	$("#data").text(JSON.stringify(snapshot.val(), null, 2))
});

db.ref("/sphere1/scale").on("value", function(snapshot){
	var value = snapshot.val()
	slider.slider('setValue', value)
})