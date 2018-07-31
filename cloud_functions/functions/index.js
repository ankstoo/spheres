const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

// exports.setSphereLastUpdate = functions.database.ref('/spheres/clients/{sphereName}/scale').onUpdate((change) => {
//   const now = admin.database.ServerValue.TIMESTAMP;
//   return change.after.ref.parent.update({"updatedAt": now});
// })

exports.setSphereHue = functions.database.ref('/spheres/clients/{sphereName}/scale').onCreate((snap, context) => {
	const hue = Math.random() * 360.0;
	return snap.ref.parent.update({"hue": hue});
})
