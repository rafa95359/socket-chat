const { io } = require('../server');

const {Usuarios} = require('../classes/usuarios');

const{crearMensaje} = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat',(data , callback) => {


        if( !data.nombre || !data.sala){            
            return callback({
                error : true,
                mensaje: 'El nombre y la sala es necesario 1'
            });
        }

        //juntar a los usuarios en una misma sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id,data.nombre,data.sala);  

        //emitir a todas las personas del chat
        //client.broadcast.emit('ListaPersona',usuarios.getPersonas() );

        //emitir solo a las personas del chat
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala) );
        client.broadcast.to(data.sala).emit('crearMensaje',crearMensaje('Administrador',`${data.nombre} se unio`) );

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje',(data,callback)=>{
        
        let persona = usuarios.getPersona(client.id);//obtener quien es la persona emisora
        let mensaje = crearMensaje(persona.nombre,data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje)

        callback(mensaje);
    });     



    client.on('disconnect',()=>{        

       let personaBorrada = usuarios.borrarPersona(client.id);       
        //client.broadcast.emit('crearMensaje',{usuario: 'administrador',mensaje: `${personaBorrada.nombre} abdandono el chat`})
        
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} salio`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala) );

    })



    client.on('mensajePrivado',data =>{

        let persona= usuarios.getPersona(client.id);
        //para hacer que solo envia a especificos
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));

    });




});