$(document).ready(function(){
    $('#chat-btn-send').click(function(){
        var message_text = $('#chat-input-message').val();
        $('#chat-input-message').val('');
        if(message_text.length > 0){
            printOwnMessage(message_text);
        }
    });
});

if(game_id){
    get_players();
    get_users();
}

function get_players(){
    socket.emit('on_lobby', {
        game_id:game_id,
    });
    socket.on('lobby_connected',function(){
        $.ajax({
            url:'/getPlayers',
            method:'GET',
            data:{
                game_id: game_id
            }
        }).done(function(response){
            if(response.status === 'ok'){
                $('#connected_players').empty();
                $('#connected_players').append(response.html);
            }else{
                Swal.fire({
                    icon: 'error',
                    text: response.message,
                })
            }
        });
    });
}

function get_users(searched){
    $.ajax({
        url:'/getConnectedUsers',
        method:'GET',
        data:{
            searched:searched
        }
    }).done(function(response){
        if(response.status === 'ok'){
            $('#connected_users').empty();
            $('#connected_users').append(response.html);
            
        }else{
            Swal.fire({
                icon: 'error',
                text: response.message,
            })
        }
    });
}

function search_users(){
    var searched = $('#search-user-input').val();
    get_users(searched);
}

function send_invitation(receiver){
    get_username()
        .then(response => {
            socket.emit('private',{
                type:'invitation',
                receiver: receiver,
                sender: response,
                text:'/game/' + game_id
            });
        }).catch(err =>{
            Swal.fire({
                icon: 'error',
                text: 'No se ha podido obtener el nombre de usuario'
            })
        });
}
socket.on('user_loged', function(){
    get_users();
})
socket.on('user_loged_out', function(msg){
    console.log(msg.username + 'ha salido');
    if($('#player-item-'+ msg.username ) !== undefined){
        $('#player-item-'+ msg.username).remove();
    }
    if($('#user-item-'+ msg.username ) !== undefined){
        $('#user-item-'+ msg.username).remove();
    }
})
//al cerrar o irse del juego
$(window).on('beforeunload', function(){
    get_username()
    .then(response => {
        socket.emit('user_out_of_game', { username:response, game_id:game_id }); 
    }).catch(err =>{
        Swal.fire({
            icon: 'error',
            text: 'No se ha podido obtener el nombre de usuario'
        })
    });
    
    $.ajax({
        url:'/delete_user_from_game',
        method:'POST',
        async: false,
        data:{
            game_id: game_id
        }
    });
});



function get_ready(clicked){
    var button_clicked = clicked;
    Swal.fire({
        title: '¿Quieres empezar?',
        icon: 'question',
        text: 'Si aceptas ya no podras deshacer la acción',
        showDenyButton: true,
        confirmButtonText: `Empezar`,
        denyButtonText: `Esperar`,
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/update_user_state',
                method:'POST',
                data:{
                    game_id: game_id,
                }
            }).done(function(response, statusText, xhr){
                if(xhr.status == 200){
                    $(button_clicked).prop("disabled",true);
                }
                if(response.all_users_ready){
                    socket.emit('all_users_ready',{ game_id:game_id })
                }
            });
            get_username()
            .then(response => {
                socket.emit('user_ready',{
                    username: response,
                    game_id: game_id
                });
            }).catch(err =>{
                Swal.fire({
                    icon: 'error',
                    text: 'No se ha podido obtener el nombre de usuario'
                })
            }); 
        }
      })
}

function printOwnMessage(text){
    get_username()
    .then(response => {
        var html = `<div class="message-container own-message-container">
            <div class="message own-message">
                <div class="msg-author">${response}</div>
                <div class="msg-text own-msg-text">${text}</div>
            </div>
        </div>`;
        $('#chat-area').append(html);
        $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);

        socket.emit('chat_msg',{
            sender: response,
            game_id:game_id,
        });
        
    }).catch(err =>{
        Swal.fire({
            icon: 'error',
            text: 'No se ha podido obtener el nombre de usuario'
        })
    });  
}

function printReceivedMessage(data){
    var html = ` <div class="message-container">
                    <div class="message">
                        <div class="msg-author">${data.sender}</div>
                        <div class="msg-text">${data.message}</div>
                    </div>
                </div>`;
    $('#chat-area').append(html);
    $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
}
socket.on('user_out_of_game',function(data){
    console.log(data);
    if($('#player-item-'+ data.username ) !== undefined){
        $('#player-item-'+ data.username).remove();
    }
})

socket.on('user_ready',function(data){
    $('#player-item-'+ data.username+' .state').text('Preparado');
})

socket.on('all_users_ready', function(){
    $('#lobby').hide();
    $('#game').show()
})
socket.on('chat_msg', function(data){
    printReceivedMessage(data);
})