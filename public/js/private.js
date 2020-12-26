function logout() {
  Swal.fire({
    title: "Vas a cerrar la sesión ¿estas seguro?",
    showDenyButton: true,
    confirmButtonText: `Aceptar`,
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      get_user_data()
        .then(response => {
          socket.emit("user_loged_out", { 
            username: response.username,
            id: response.id
          });
          window.location.href = "/logout";
        }).catch(err =>{
          Swal.fire({
              icon: 'error',
              text: 'No se ha podido obtener el nombre de usuario'
          })
      });
      
    }
  });
}

var url = window.location.protocol+'//'+window.location.hostname + (window.location.hostname=='localhost'?":3000":'')
var socket = io(url);
get_user_data()
  .then(response => {
    socket.emit("user_join", { username: response.username });
  }).catch(err =>{
    Swal.fire({
        icon: 'error',
        text: 'No se ha podido obtener el nombre de usuario'
    })
});
socket.on("private", function (msg) {
  if (msg.type === "invitation") {
    var port = msg.port;
    var text = msg.text;
    Swal.fire({
      title: "Has recibido una invitación de " + msg.sender,
      showDenyButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Rechazar`,
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("private", {
          type: "invitation_accepted",
          sender: msg.receiver,
          receiver: msg.sender,
          text: msg.receiver + " ha aceptado la invitación",
        });
        var redirection_url =
          location.protocol +
          "//" +
          window.location.hostname +
          ":" +
          port +
          text;
        window.location.href = redirection_url;
      } else if (result.isDenied) {
        socket.emit("private", {
          type: "invitation_rejected",
          sender: msg.receiver,
          receiver: msg.sender,
          text: msg.receiver + " no ha aceptado la invitación",
        });
      }
    });
  } else if (msg.type === "invitation_accepted") {
    Swal.fire({
      icon: "success",
      text: msg.text,
    });
  } else if (msg.type === "invitation_rejected") {
    Swal.fire({
      icon: "error",
      text: msg.text,
    });
  }
});
socket.on("message", function (data) {});

function get_user_data(){
  var user_promise = new Promise( (resolve, reject) => {
      $.ajax({
          url:'/get_user_data',
      }).done(function(data, textStatus, jqXhr){
         resolve(data);
      }).fail( function(err){
          reject(err);
      });
  });

  return user_promise;
}

