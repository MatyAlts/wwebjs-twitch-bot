const wwebVersion = '2.2412.54';
const https = require('https');
const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia, Message, GroupChat } = require('whatsapp-web.js/src/structures');
const mime = require('mime-types');
const axios = require('axios');
const schedule = require('node-schedule');
const cursosPath = './config/cursos.json';
const { esAdmin, strMes } = require('./functions.js');

exports.eventHandlers = function (client){
    client.on('message', async (msg) => {
        if (msg.body == '!commands'){
            
            msg.reply('Estos son los comandos disponibles actualmente 😉\n\n!sticker:\nEnvia una foto con !sticker en la descripcion para convertirlo en sticker\n\n!everyone:\nEtiqueta a todos los participantes del grupo (solo admin)\n\n!everyone-massive:\nVersión optimizada para grupos grandes (+500 miembros)\n\n!validacion:\n(experimental solo admin)\n\n!device:\nVerifica si tienes android o ios\n\n!rol:\nPermite identificar tu rol en el grupo\n\n!recordatorio:\nCrear un recordatorio 🕑:\n\nEjemplo: !recordatorio 30m Reunión importante')
        }
    });

client.on('message', async (msg) => {
    if(msg.body === '!validacion'){
        const chat = await msg.getChat();
        let user = await msg.getContact();
        console.log(chat.id.user);
        console.log(user.id.user)
        let Admin = false;
        Admin = await esAdmin(msg);
        if(user.id.user == '173357899231380'){
            console.log(msg);
            const myString = JSON.stringify(msg).replace(/\,/g, ',\n\n');
            msg.reply(myString);
            console.log(msg.id.participant)
        } else msg.reply('Comando restringido a administradores')
        
    }

})
client.on('message', async (msg) => {
    if (msg.body.startsWith('!testing')) {
        const chat = await msg.getChat();
        console.log(chat.isGroup);
    }
})

client.on('message', async (msg) => {
if (msg.body.startsWith('!horarioCursado')){
    const chat = await msg.getChat();
    let user = await msg.getContact();
    if(chat.isGroup){
        console.log('primer pass')
        if(chat.id.user == '120363311325676314' || chat.id.user == '120363323288337801'){
            console.log('segundo pass')
            parts = msg.body.split(' ')
            if(parts.length > 1){
                console.log('tercer pass')
                try{
                    console.log('cuarto pass')
                    fs.readFile(cursosPath, 'utf8', (err, data) => {
                        if (err) {
                          console.error('Error al leer el archivo JSON:', err);
                          return;
                        } try{
                            const cursos = JSON.parse(data);
                            let dia = parts[1].toLowerCase()
                            nombreDia = dia
                            dia = cursos.cursos[dia];
                            msg.reply(`*${nombreDia}*\n\nMateria: ${dia.nombre}\nHora: ${dia.hora}\n\nComo llegar:\n${dia['como-llegar']}`)
                        } catch (parseError) {
                            console.error('Error al parsear el archivo JSON:', parseError);
                          }
                    }
                );
                        let dia = parts[1].toLowerCase()
                        dia = data.cursos.$(dia);
                        msg.reply(`*${dia}*\nMateria: ${dia.nombre}\nHora: ${dia.hora}\nComo llegar: ${dia['como-llegar']}`)
                } catch (err) {

                }
            }
        }
    }
}
})

client.on('message', async (msg) => {
    if (msg.body === '!everyone') {
        const chat = await msg.getChat();
        console.log(chat.id.user)
        let user = await msg.getContact();
        
        try {
            if((chat.id.user == '51943297699-1622310081')){
                if((user.id.user == '5492612071333') || (user.id.user == '173357899231380') || (user.id.user == '14959421468781')){
                    console.log('Iniciando mención masiva optimizada...');
                    
                    // Obtener todos los participantes
                    const participants = chat.participants;
                    console.log(`Total de participantes: ${participants.length}`);
                    
                    // Dividir participantes en chunks de 100 para evitar límites de WhatsApp
                    const chunkSize = 100;
                    const chunks = [];
                    
                    for (let i = 0; i < participants.length; i += chunkSize) {
                        chunks.push(participants.slice(i, i + chunkSize));
                    }
                    
                    console.log(`Enviando en ${chunks.length} mensajes separados`);
                    
                    // Enviar primer mensaje con texto principal
                    let firstText = "Prendemos stream gentee \n\n";
                    let firstMentions = [];
                    
                    // Añadir primeros 100 participantes al primer mensaje
                    for (let participant of chunks[0]) {
                        firstMentions.push(`${participant.id.user}@c.us`);
                        firstText += `@${participant.id.user} `;
                    }
                    
                    await chat.sendMessage(firstText, { mentions: firstMentions });
                    
                    // Enviar chunks restantes con delay para evitar spam
                    for (let i = 1; i < chunks.length; i++) {
                        // Delay de 2 segundos entre mensajes
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        let text = `📢 Continuación (${i + 1}/${chunks.length}):\n\n`;
                        let mentions = [];
                        
                        for (let participant of chunks[i]) {
                            mentions.push(`${participant.id.user}@c.us`);
                            text += `@${participant.id.user} `;
                        }
                        
                        await chat.sendMessage(text, { mentions });
                        console.log(`Chunk ${i + 1}/${chunks.length} enviado`);
                    }
                    
                    console.log('Mención masiva completada');
                }
            } else if (((chat.id.user != '51943297699-1622310081'))){
                // Para otros grupos, usar el método optimizado también
                console.log('Mención masiva en grupo genérico...');
                
                const participants = chat.participants;
                const chunkSize = 100;
                const chunks = [];
                
                for (let i = 0; i < participants.length; i += chunkSize) {
                    chunks.push(participants.slice(i, i + chunkSize));
                }
                
                // Enviar en chunks con delay
                for (let i = 0; i < chunks.length; i++) {
                    if (i > 0) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                    let text = i === 0 ? "📢 Atención todos:\n\n" : `📢 Continuación (${i + 1}/${chunks.length}):\n\n`;
                    let mentions = [];
                    
                    for (let participant of chunks[i]) {
                        mentions.push(`${participant.id.user}@c.us`);
                        text += `@${participant.id.user} `;
                    }
                    
                    await chat.sendMessage(text, { mentions });
                }
            }
        } catch (error) {
            console.error('Error en mención masiva:', error);
            msg.reply('❌ Error al mencionar a todos los participantes. El grupo es muy grande, intenta nuevamente.');
        }
    }
});

// Comando optimizado para grupos masivos
client.on('message', async (msg) => {
    if (msg.body === '!everyone-massive' || msg.body === '!todos-masivo') {
        const chat = await msg.getChat();
        let user = await msg.getContact();
        
        try {
            // Verificar permisos de admin
            let isAdmin = false;
            if (chat.isGroup) {
                const participant = chat.participants.find(p => p.id.user === user.id.user);
                isAdmin = participant && participant.isAdmin;
            }
            
            if (!isAdmin) {
                msg.reply('❌ Solo los administradores pueden usar este comando');
                return;
            }
            
            const participants = chat.participants;
            console.log(`Iniciando mención masiva para ${participants.length} participantes`);
            
            // Configuración optimizada para grupos muy grandes
            const chunkSize = 100; // Chunks más pequeños para mayor estabilidad
            const delayBetweenChunks = 2000; // 3 segundos entre mensajes
            const chunks = [];
            
            for (let i = 0; i < participants.length; i += chunkSize) {
                chunks.push(participants.slice(i, i + chunkSize));
            }
            
            // Mensaje inicial informativo
            await msg.reply(`🚀 Iniciando mención masiva para ${participants.length} miembros en ${chunks.length} mensajes.\n⏱️ Esto tomará aproximadamente ${Math.ceil(chunks.length * 3)} segundos.`);
            
            // Enviar chunks con progreso
            for (let i = 0; i < chunks.length; i++) {
                try {
                    // Delay excepto en el primer mensaje
                    if (i > 0) {
                        await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
                    }
                    
                    let text = '';
                    if (i === 0) {
                        text = "🔴 ¡STREAM EN VIVO! 🎮\n\n";
                    } else {
                        text = `📢 Parte ${i + 1}/${chunks.length}:\n\n`;
                    }
                    
                    let mentions = [];
                    
                    for (let participant of chunks[i]) {
                        mentions.push(`${participant.id.user}@c.us`);
                        text += `@${participant.id.user} `;
                    }
                    
                    await chat.sendMessage(text, { mentions });
                    console.log(`✅ Chunk ${i + 1}/${chunks.length} enviado (${chunks[i].length} menciones)`);
                    
                } catch (chunkError) {
                    console.error(`❌ Error en chunk ${i + 1}:`, chunkError);
                    // Continuar con el siguiente chunk en caso de error
                }
            }
            
            // Mensaje de finalización
            await new Promise(resolve => setTimeout(resolve, 1000));
            await msg.reply(`✅ Mención masiva completada! Se mencionaron ${participants.length} miembros en ${chunks.length} mensajes.`);
            await chat.sendMessage('kick.com/teosilvas')

        } catch (error) {
            console.error('Error en mención masiva:', error);
            msg.reply('❌ Error crítico en la mención masiva. Contacta al desarrollador.');
        }
    }
});

client.on('message', async (msg) =>{
    if (msg.body == '!soysub'){
        const chat = await msg.getChat();
        if(!chat.isGroup){
        msg.reply('Para verificar que seas subscriptor, sigue los pasos a continuacion:\n\nEnvia una captura de tu suscripcion junto al comando \n!verificar\n\nNuestros moderadores verificaran si eres suscriptor y te agregarán al grupo de whatsapp.')
    } else msg.reply('Este comando solo esta disponible en privado.')
} 

})

client.on('message', async (msg) => {
if(msg.body == '!debug'){
    const chat = await msg.getChat();
    console.log(chat.id._serialized);
}
})

client.on('message', async (msg) =>{
if(msg.body == '!verificar'){
    const chat = await msg.getChat();
    const user = await msg.getContact();
    if(!chat.isGroup){
    if(msg.hasMedia){
    console.log(chat.id._serialized);
        await msg.forward('120363217051218653@g.us',{ displayAsForwarded: false })
        client.sendMessage('120363217051218653@g.us','Numero de telefono: +' + user.id.user)
        msg.react('👍');
        msg.reply('Nuestros moderadores estan verificando tu mensaje 😊')
    } else msg.reply('Debes enviar la foto y colocar \n!verificar como descripcion de la foto.')

    } 
} 
})

client.on('message', async (msg) =>{
if(msg.body == '!verificar2'){
    if(msg.hasMedia){
        msg.react('👍');
        const chat = await msg.getChat();
        const user = await msg.getContact();
    console.log(chat.id._serialized);
    if(!chat.isGroup){
        //
    }
    } else msg.reply('Debes enviar la foto y colocar \n!verificar como descripcion de la foto.')
} 
})

client.on('message', async (msg) => {
if(msg.body.startsWith('!recordatorio')) {
    const parts = msg.body.split(' ');
    if(parts.length < 3) {
        msg.reply('Por favor, proporciona los minutos y el mensaje para el recordatorio. Ejemplo: !recordatorio 30m Reunión importante');
        return;
    }

    const timeString = parts[1];
    const message = parts.slice(2).join(' ');

    const timeUnit = timeString.charAt(timeString.length - 1);
    const timeValue = parseInt(timeString.slice(0, -1));

    if(isNaN(timeValue) || timeValue <= 0) {
        msg.reply('Por favor, proporciona un número válido de tiempo para el recordatorio.');
        return;
    }

    let reminderTime;
    if (timeUnit === 'm') {
        reminderTime = new Date(Date.now() + timeValue * 60000);
    } else if (timeUnit === 'h') {
        reminderTime = new Date(Date.now() + timeValue * 3600000);
    } else if (timeUnit === 's') {
        reminderTime = new Date(Date.now() + timeValue * 1000);
    } else {
        msg.reply('Por favor, utiliza "m" para minutos, "h" para horas o "s" para segundos.');
        return;
    }

    schedule.scheduleJob(reminderTime, function(){
        msg.reply(`Es hora de: ${message}`);
    });

    msg.reply(`Recordatorio establecido para dentro de ${timeValue} ${timeUnit} con el mensaje: "${message}"`);
}
});

client.on('message', async (msg) =>{
if(msg.body == '!rol'){
    let adminVerify = false;
    adminVerify = await esAdmin(msg);
    if(adminVerify){
        msg.reply('Administrador');
    }
    else msg.reply('Usuario')
}
})

client.on('message', async msg => {
if (msg.body.startsWith('!agregarParcial')){
    const parts = msg.body.split(' ')
    if(parts.length > 2){
        const materia = parts[1]
        const fecha = parts[2]
        let listaFecha = []
        listaFecha = fecha.split('/')
        let dia
        let mes
        if(listaFecha.length == 2 ){
            try{
                dia = parseInt(listaFecha[0])
            } catch (err){
                msg.reply('Formato invalido', err)
            }
            if(dia > 0 && dia < 32){
                mes = strMes(parseInt(listaFecha[1]))
                if (mes == undefined){
                    msg.reply('Mes invalido!')
                } else {
                    msg.reply(`Recordatorio de ${materia} creado para el dia ${dia} de ${mes}`)
                    //codigo
                }
            } else {
                msg.reply('Dia invalido!')
            }
        } else{
            console.log(listaFecha)
            console.log(listaFecha.length)
            msg.reply('Formato de fecha invalido!')
        }
    } else {
        msg.reply('Ingrese la materia y la fecha.\nEjemplo: !agregarParcial Matematica 25/10')
    }
}
})



client.on('message', msg => {
if (msg.body == '!device'){
    if (msg.deviceType === 'ios'){
        msg.reply('Utilizas iOS')
    }
    if (msg.deviceType === 'android'){
        msg.reply('Utilizas Android')
    }
    if (msg.deviceType === 'web'){
        msg.reply('Utilizas PC')
    }
    else console.log(msg.deviceType);
}
})

client.on('message', async msg => {
if (msg.body.startsWith('!enviar')){
    const parts = msg.body.split(' ');
    const filename = (parts[1]);
    if(fs.existsSync(`./downloads/${filename}`)){
        const media = MessageMedia.fromFilePath(`./downloads/${filename}`);
        await client.sendMessage(msg.from, media)
    }
    else{
        msg.reply('El archivo solicitado no existe.')
    }
}
})

client.on('message', async msg => {
if (msg.body.startsWith('!eliminar')){
    const parts = msg.body.split(' ');
    const filename = (parts[1]);
    let temp = filename
    if(fs.existsSync(`./downloads/${filename}`)){
        fs.unlinkSync(`./downloads/${filename}`);
        msg.reply(`Archivo ${temp} eliminado!`)
    }
    else{
        msg.reply('El archivo solicitado no existe.')
    }
}
})

client.on('message', async msg => {
if (msg.body === '!horario'){
    const filename = 'horario.xlsx'
    if(fs.existsSync(`./downloads/${filename}`)){
        const media = MessageMedia.fromFilePath(`./downloads/${filename}`);
        await client.sendMessage(msg.from, media)
    }
    else{
        msg.reply('El archivo solicitado no existe.')
    }
}
})

client.on('message', async msg => {
if (msg.body === '!horario'){
    const filename = 'horario.jpeg'
    if(fs.existsSync(`./downloads/${filename}`)){
        const media = MessageMedia.fromFilePath(`./downloads/${filename}`);
        await client.sendMessage(msg.from, media)
    }
    else{
        msg.reply('El archivo solicitado no existe.')
    }
}
})



client.on('message', msg => {
if (msg.body == 'test'){
    var t_value = Math.floor(Math.random() * 7);
    if(t_value === 0){
    msg.reply("random 1")
}
else if (t_value === 1){
    msg.reply("random 2")
}
else if (t_value === 2){
    msg.reply("random 3")
}
else if (t_value === 3){
        msg.reply("random 4")
}
else if (t_value === 4){
        msg.reply("random 5")
}
else if (t_value === 5){
        msg.reply("random 6")
}
else if (t_value === 6){
        msg.reply("random 7")
}
else if (t_value === 7){
        msg.reply("random 8")
}
}
else if (msg.hasMedia){
    if (msg.body == '!sticker'){
        msg.downloadMedia().then(media => {
            if (media) {
                const mediaPath = './downloaded-media/';
                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                const extension = mime.extension(media.mimetype);
                const filename = new Date().getTime();
                const fullFileName = mediaPath + filename + '.' + extension;

                if (media.mimetype.includes('video')) {
                    // Respond to user that videos are not supported yet
                    client.sendMessage(msg.from, '¡Lo siento! Todavía no es compatible con videos.');
                } else {
                    // Save and send sticker for non-video files
                    try {
                        fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' });
                        console.log('File Downloaded Successfully', fullFileName);
                        console.log(fullFileName);
                        MessageMedia.fromFilePath(filePath = fullFileName);
                        client.sendMessage(msg.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true, stickerAuthor: "By MatyAlts's Bot", stickerName: "@maty.torres_" });
                        fs.unlinkSync(fullFileName);
                        console.log(`File Deleted Successfully`);
                    } catch (err) {
                        console.log('Failed to Save the File', err);
                        console.log(`File Deleted Successfully`);
                    }
                }
            }
        });
    }


}



});
}