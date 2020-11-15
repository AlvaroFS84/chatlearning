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

window.onunload = unloadPage;

function unloadPage(){
    alert("unload event detected!");
}