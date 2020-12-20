var game_answers  = [];

$(document).ready(function(){
    $("#search-user-input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            search_users();
        }
    });

    $('#chat-btn-send').click(function(){
        var message_text = $('#chat-input-message').val();
        $('#chat-input-message').val('');
        if(message_text.length > 0){
            printOwnMessage(message_text);
        }
    });
    $("#chat-input-message").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            var message_text = $(this).val();
            $(this).val('');
            if(message_text.length > 0){
                printOwnMessage(message_text);
            }
        }
    });

    $('.answer-radio').on('click',function(){
        if($(this).siblings('.answer-btn').prop('disabled'))
            $(this).siblings('.answer-btn').prop('disabled',false);
        
        socket.emit('question_answered',{
                game_id: game_id,
                answer_id: $(this).attr('id')
        });
    });

    $('.answer-btn').on('click', function(){
        var cliked = this;
        if($(this).hasClass('next-btn')){    
            insert_answer_value(cliked);
            next_question($(this));
            socket.emit('next_question',{
                game_id: game_id,
                button_id: $(this).attr('id')
            });

        }else if($(this).hasClass('end-btn')){
            Swal.fire({
                title: 'Vas a finalizar el test, ¿Estás seguro?',
                showDenyButton: true,
                confirmButtonText: `Finalizar`,
                denyButtonText: `Cancelar`,
              }).then((result) => {
                if (result.isConfirmed) {
                    insert_answer_value(cliked);
                    $(cliked).prop('disabled',true);
                    //calcular la puntiuacion aqui , 
                    //enviar array de puntuaciones y 
                    //calcular en el backend
                    console.log('game_id ',game_id);
                    console.log('game_answers ',game_answers);
                    $.ajax({
                        url:'/calculate_result',
                        method: 'POST',
                        data:{
                            game_id: game_id,
                            game_answers: JSON.stringify(game_answers)
                        }
                    }).done(function(response){
                        if(response.status == 'ok'){
                            //mostrar un aler con notificacion y enviar un
                            //evento para que les salga a todos
                            //despues redirigir a /
                            //alert(response.calification);
                            socket.emit('game_finished', {
                                game_id: game_id,
                                calification: response.calification
                            });
                        }
                    });
                } 
            })
        }
       
       
    })

    
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
    get_user_data()
        .then(response => {
            socket.emit('private',{
                type:'invitation',
                receiver: receiver,
                sender: response.username,
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
    if($('#player-item-'+ msg.id ) !== undefined){
        $('#player-item-'+ msg.id).remove();
    }
    if($('#user-item-'+ msg.id ) !== undefined){
        $('#user-item-'+ msg.id).remove();
    }
})
//al cerrar o irse del juego
$(window).on('beforeunload', function(){
    get_user_data()
    .then(response => {
        socket.emit('user_out_of_game', { username:response.username, game_id:game_id }); 
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
            get_user_data()
            .then(response => {
                socket.emit('user_ready',{
                    id: response.id,
                    username: response.username,
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
    get_user_data()
    .then(response => {
        var html = `<div class="message-container own-message-container">
            <div class="message own-message">
                <div class="msg-author">${response.username}</div>
                <div class="msg-text own-msg-text">${text}</div>
            </div>
        </div>`;
        $('#chat-area').append(html);
        $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);

        socket.emit('chat_msg',{
            sender: response.username,
            game_id:game_id,
            message: text
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

function next_question(clicked){
    var question = clicked.parent();
    question.hide();
    question.next().show();
}

function insert_answer_value(cliked){
    var radio_answered = $(cliked).parent().find('.answer-radio:checked');
    game_answers.push(radio_answered.val());
    socket.emit('update_game_answers',{
        game_id: game_id,
        game_answers: game_answers
    });
}

socket.on('user_out_of_game',function(data){
    if($('#player-item-'+ data.username ) !== undefined){
        $('#player-item-'+ data.username).remove();
    }
})

socket.on('user_ready',function(data){
    $('#player-item-'+ data.id+' .state').text('Preparado');
})

socket.on('all_users_ready', function(){
    $.ajax({
        url:'/update_game_state',
        method: 'POST',
        data:{
            game_id: game_id,
            game_state: 'playing'
        }
    }).done(function(data, textStatus, jqXhr){
        if(jqXhr.status == 200 ){
            $('#lobby').hide();
            $('#game').css('display','flex');
        }else{
            Swal.fire({
                icon: 'error',
                text: 'Lo sentimos, ha ocurrido un error al iniciar el test',
            })
        }
    });
    
})
socket.on('chat_msg', function(data){
    printReceivedMessage(data);
})
socket.on('question_answered', function(data){
    $('#' + data.answer_id).prop('checked',true)
        .siblings('.answer-btn').prop('disabled',false);
})
socket.on('next_question', function(data){
    next_question($('#' + data.button_id));
});
socket.on('game_finished', function(data){
    Swal.fire({
        title: 'La calificación del test es '+ data.calification,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: `Aceptar`,
      }).then((result) => {
        if (result.isConfirmed) {
          document.location.href = '/';
        }
      })
});
socket.on('update_game_answers', function(data){
    game_answers = data.game_answers;
});