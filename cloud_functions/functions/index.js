const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.setSphereLastUpdate = functions.database.ref('/sphere1/scale').onUpdate((change) => {
  const now = admin.database.ServerValue.TIMESTAMP;
  console.log('last-update', now);
  return change.after.ref.parent.update({"updatedAt": now});
})
