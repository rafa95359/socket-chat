var params = new URLSearchParams(window.location.search);


var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


//Funciones para renderizar usuarios

function renderizarUsuarios(personas){
    console.log(personas);

    var html ='';
    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    html +=  '</li>';

    for(var i=0; i<personas.length;i++){
        html += '<li>';
        //lo que esta en data-id es lo que se muestra despues $(this).data('id');   
        html += '   <a data-id="' + personas[i].id +  '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+ '<small class="text-success">online</small></span></a>';
        html +=  '</li>';

    }
    divUsuarios.html(html);
   
}


function renderizarMensajes(mensaje,yo){
    var html = '';
    var fecha=new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':'+fecha.getMinutes();

    var adminClass = 'info';
    if(mensaje.nombre ==='Administrador'){
        adminClass='danger';
    }

    if(yo){
        html +='<li class="reverse">';
        html +='    <div class="chat-content">';
        html +='        <h5>'+mensaje.nombre+'</h5>';
        html +='        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html +='    </div>';
        html +='    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html +='    <div class="chat-time">'+hora+'</div>';
        html +='</li>';
    }else{
        html += '<li class="animated fadeIn">';
        if(mensaje.nombre !=='Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }
        
        
        
    divChatbox.append(html);
}

//Para mover la pantalla 
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}






//Listener.Con el 'a' le decimos que este pendiente de cada uno de los <a >que esta dentro de divUsuarios
divUsuarios.on('click','a',function(){
    var id= $(this).data('id');    
    if(id){
        console.log(id);
    }
})

formEnviar.on('submit',function(e){
    e.preventDefault();//evita que al darle enter(submit) se reinicie la pagina
    if(txtMensaje.val().trim().length === 0){//trim quita los espacios adelante y al final
        return;
    };
  
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        //console.log(mensaje);
        txtMensaje.val('').focus();//para que al final el texto en el chat se borre
        renderizarMensajes(mensaje,true);
        scrollBottom();
    }); 




})