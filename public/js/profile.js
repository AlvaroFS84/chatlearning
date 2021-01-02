/**
 * Comprueba que las dos contraseñas sean iguales
 * @param input 
 */
function check_new_password(input){
    var new_pass = $('#new_password').val();
    var repeated_pass = $(input).val();
    if(new_pass != repeated_pass){
        input.setCustomValidity('Las contraseñas no coinciden.');
    }else{
        input.setCustomValidity('');
    }
}