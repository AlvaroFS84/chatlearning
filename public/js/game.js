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
    socket.emit('private',{
        type:'invitation',
        receiver: receiver,
        sender: username,
        text:'/game/' + game_id
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
    socket.emit('user_out_of_game', { username:username, game_id:game_id }); 
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
            socket.emit('user_ready',{
                username: username,
                game_id: game_id
            });
        }
      })
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