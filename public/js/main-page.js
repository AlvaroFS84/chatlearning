$(document).ready(function(){

    $('#search-user-input').keyup(function(e){
        var code = e.keyCode || e.which;
        if(code == 13){
            searchTest();            
        }
    });
});
/**
 * Realiza la petición para la busqueda de tests
 */
function searchTest(){
    var searched = $('#search-user-input').val();
    
    $.ajax({
        url:'/search-test',
        method: 'GET',
        data:{
            searched:searched
        }
    }).done(function(response){
        if(response.data.error){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data.error,
              })
        }else{
            $('#test-list').empty();
            $('#test-list').append(response.data.html);
        }
    });    
}
/**
 * Envía a la pagina del test que se va a realizar
 * @param test_id 
 */
function go_to_test(test_id){
    Swal.fire({
        title: 'Vas a crear una nueva sala de test ¿estás seguro?',
        showDenyButton: true,
        confirmButtonText: `Aceptar`,
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/jugar/"+test_id;
        } 
    })
}
