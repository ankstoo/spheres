
$(function() {
    update();
});

var db = firebase.database()
var ref = db.ref();
                      
ref.on("value", function(snapshot){
	$("#data").text(JSON.stringify(snapshot.val(), null, 2))
});

var backgroundSlider = $('#backgroundSlider').slider()
$('#backgroundSlider').on("change", function(ev) {
	var value = ev.value.newValue;
	changeBackground(value);
})

var scaleSlider = $('#scaleSlider').slider()
$("#scaleSlider").on("change", function(ev) {
	var value = ev.value.newValue;
	changeScale(value);
});

$("#buttonStart").click(function(){
	start();
});

var sphereName = undefined
var active = false
var backgroundHue = undefined
var cookieName = "user-name-7"

function start() {
	var name = 'sphere_' + Math.random().toString(36).substr(2, 9);
	Cookies.set(cookieName, name);
	update();
	changeScale(0.1);
}

function update() {
	wasActive = active
	sphereName = Cookies.get(cookieName);
	active = sphereName != undefined;

	if (!wasActive && active) {
		subscribe();
	}

	updateUi();
}

function updateUi() {
	if (active) {
		$("#panelNew").hide(0);
		$("#panelActive").show(0);
	} else {
		$("#panelNew").show(0);
		$("#panelActive").hide(0);
	}	

	if (backgroundHue != undefined) {
		backgroundColor = hslToHex(backgroundHue, 90, 50);
		$(document.body).css("background-color", backgroundColor);
	}
}

function subscribe() {
	if (!active) {
		return;
	}

	var path = "/spheres/clients/" + sphereName + "/";
	db.ref(path + "scale").on("value", function(snapshot) {
		var value = snapshot.val();
		scaleSlider.slider('setValue', value);
		updateUi();
	})

	db.ref(path + "hue").on("value", function(snapshot) {
		backgroundHue = snapshot.val();
		updateUi();
	})

	db.ref("/spheres/common/hue").on("value", function(snapshot) {
		var value = snapshot.val();
		backgroundSlider.slider('setValue', value);
		updateUi();
	})

}

function changeBackground(newHue) {
	if (!active) {
		return;
	}

	var path = "/spheres/common/hue";
	db.ref(path).set(newHue);
}

function changeScale(newScale) {
	if (!active) {
		return;
	}

	var path = "/spheres/clients/" + sphereName + "/scale";
	db.ref(path).set(newScale);
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

