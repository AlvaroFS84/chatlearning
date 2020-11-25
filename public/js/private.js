function logout() {
  Swal.fire({
    title: "Vas a cerra la sesión¿estas seguro?",
    showDenyButton: true,
    confirmButtonText: `Aceptar`,
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      get_username()
        .then(response => {
          socket.emit("user_loged_out", { username: response });
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
//esto falla si no se cambia a la plantilla
var socket = io("http://localhost:3000");
get_username()
  .then(response => {
    socket.emit("user_join", { username: response });
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

function get_username(){
  var user_promise = new Promise( (resolve, reject) => {
      $.ajax({
          url:'/get_username',
      }).done(function(data, textStatus, jqXhr){
         resolve(data);
      }).fail( function(err){
          reject(err);
      });
  });

  return user_promise;
}

