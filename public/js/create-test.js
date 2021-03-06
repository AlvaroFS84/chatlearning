$(document).ready(function(){
    var n_question = 2;
    
    $('#add-question').click(function(){
        const question_html = `
        <div class="question" id="question-${n_question}">
            <div class="form-group">
                <label for="question-text"><h3>Pregunta</h3></label>
                <input type="text" class="form-control question-text" placeholder="Introduce el texto de la pregunta" required>
            </div>
            <h4 class="answers-title">Respuestas</h4>
            <div class="answer_container" id="answer-container-${n_question}">
                <div class="form-group answer-group answer">
                    <input type="text" name='answer-text-${n_question}-1' class="form-control answer-text" placeholder="Introduce el texto de la respuesta" required>
                    Correcta <input class="answer-value" type="radio" name="radio-value-correct-${n_question}" name="radio-value-${n_question}" required>
                </div>
                <div class="form-group answer-group answer">
                    <input type="text" name='answer-text-${n_question}-2' class="form-control answer-text" placeholder="Introduce el texto de la respuesta" required>
                    Correcta <input class="answer-value" type="radio" name="radio-value-correct-${n_question}" name="radio-value-${n_question}">
                </div>
            </div>
            <div class="question-button-row"><span class="btn base-btn rounded-input" onclick="addAnswer(${n_question})">Añadir respuesta</span></div>
            <div class="question-button-row"><span class="btn base-btn rounded-input" onclick="removeAnswer(${n_question})">Quitar respuesta</span></div>
        </div>`;  

        if($('.question-text').length < 20){
            $('#questions-container').append(question_html);
            n_question++;   
        }
    })
    /**
     * Borra pregunta de test
     */
    $('#delete-question').click(function(){
        let n_question = $('.question').length;
        if(n_question > 1){
            $('.question')[n_question-1].remove();
        }
    });
    /**
     * Evento enviar el formulario de crear test
     */
    $('#save-test-form').submit(function(e){
        e.preventDefault();
        var test = formToObject();
        if(test){
            submitTest(test)
        }else{
            alert('objeto vacio');
        }
    })
})
/**
 * Almacena las respuestas del test en un objeto
 */
function formToObject(){
    var test = {
        title:$('#test-name').val(),
        questions:[]
    };

    $('.question').each(function(){
        var question = {
            text:$(this).find('.question-text').val(),
            answers:[]
        }
        $($(this).find('.answer-group')).each(function(){
            var answer = {
                text: $(this).find('.answer-text').val(),
                correct: $(this).find('.answer-value').is(':checked')?true:false
            }
            question.answers.push(answer);
        });
        test.questions.push(question);
    });

    return jQuery.isEmptyObject(test)?false:test;
}
/**
 * Envia el formulario del test
 * @param test 
 */
function submitTest(test){
    var json_test = JSON.stringify(test);
    $.ajax({
        url:'/guardar-test',
        method:'POST',
        contentType: "application/json",
        data: json_test
    }).done(function(response){
        if(response.status === 'ok'){
            Swal.fire({
                text: 'El test se ha guardado correctamente',
                icon: 'success',
                confirmButtonColor: '#05336B'
             }).then(function(){
                document.location.href = "/";
             });
        }else{
            Swal.fire({
                text: 'Ha ocurrido un problema al intentar guardar el test',
                icon: 'error',
                confirmButtonColor: '#05336B'
             });
        }
    });
}
/**
 * Añade pregunta al test
 * @param question 
 */
function addAnswer(question){
    var n_answers = $('#answer-container-'+ question +' .answer-group').length;
    if( n_answers < 5){
        var new_answer = `
        <div class="form-group answer-group">
            <input type="text" name="answer-text-${question}-${(n_answers+1)}" class="form-control answer-text" placeholder="Introduce el texto de la respuesta" required>
            Correcta <input class="answer-value" type="radio" name="radio-value-correct-${question}" name="radio-value-${question}">
            </div>
        `;
        $('#answer-container-' + question).append(new_answer);
    }   
}
/**
 * Elimina pregunta del test
 * @param question 
 */
function removeAnswer(question){
    var last_answer = $('#answer-container-' + question +' .answer-group').length;
    if(last_answer >2 ){
        $('#answer-container-' + question +' .answer-group')[last_answer-1].remove();
    }
}