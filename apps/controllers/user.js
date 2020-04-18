const firebase = require("firebase-admin");
const FCM = require('fcm-node');
const config = require('config');

var serverKey = config.get("server_key");

var fcm = new FCM(serverKey);

var db = firebase.database();
var ref = db.ref("users");

exports.getListUser = async(req, res, next) => {
    const uemail = req.query.name;
    let uid = [];
    let name = [];
    let email = [];
    let phone = [];
    let address = [];
        if (uemail) {
            ref.orderByChild('email').equalTo(uemail).once("value", function(snap) { 
                snap.forEach(function(childsnap) {
                    uid.push(childsnap.key);
                    name.push(childsnap.child("name").val());
                    email.push(childsnap.child("email").val());
                    phone.push(childsnap.child("phone").val());
                    address.push(childsnap.child("address").val());
                });
                res.render("user/list-user", {idu: uid, name: name, email: email, phone: phone, address: address});
            }).catch(err => {res.status(404).end({message: 'Fall value find!!!'})});
        }
        else 
            ref.once("value").then(snapshot => {
                snapshot.forEach(function(childsnapshot) {
                    uid.push(childsnapshot.key);
                    name.push(childsnapshot.child("name").val());
                    email.push(childsnapshot.child("email").val());
                    phone.push(childsnapshot.child("phone").val());
                    address.push(childsnapshot.child("address").val());
                });
                res.render("user/list-user", {idu: uid, name: name, email: email, phone: phone, address: address});
            }).catch(err => {res.status(404).send(err)});
    
};

exports.getPushNotification = async(req, res, next) => {
    ref.child(req.params.idu).once("value").then(snapshot => {
        res.render('user/push-notification', {idu: req.params.idu, tokenID: snapshot.child("tokenID").val()});
    });
};

exports.postSendFcmNotification = async(req, res, next) => {
    var message = {
        to: req.params.tokenID,
        priority: 'high',
        senderID: config.get("sender_id"),
        notification: {
            title: req.body.title, 
            body: req.body.description
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            res.status(404).send(err);
        } else {
            console.log("Successfully sent with response!");
            res.redirect('/admin/user');
        }
    });
};
