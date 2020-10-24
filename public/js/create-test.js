$(document).ready(function(){
    const question_html = `
    <h2>
        aaaaaa
    </h2>`;

    $('#add-question').on('click',function(){
        //$('#questions-container').append("{% include './create-question.twig'  %}");    
        $('#questions-container').append(question_html);    
    })
})