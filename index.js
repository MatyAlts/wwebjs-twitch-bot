const wwebVersion = '2.2412.54';
const https = require('https');
const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia, Message, GroupChat } = require('whatsapp-web.js/src/structures');
const mime = require('mime-types');
const axios = require('axios');

async function esAdmin (msg){
    cliente = await msg.getContact();
    chat = await msg.getChat();
    const clienteEnGrupo = chat.participants.find(chatObj => chatObj.id.user === cliente.id.user)
    if(clienteEnGrupo.isAdmin){
        return true;
    }
    else return false;
}
// Path donde la sesión va a estar guardada
//NO ES NECESARIO
//const SESSION_FILE_PATH = './session.json';

// Cargar sesión en caso de que exista una ya guardada
//NO ES NECESARIO
//let sessionData;
//if(fs.existsSync(SESSION_FILE_PATH)) {
//    sessionData = require(SESSION_FILE_PATH);
//}

// Uso de valores guardados
// ¡LINEA MODIFICADA!
//const client = new Client({
//    authStrategy: new LegacySessionAuth({
//        session: sessionData
//    })
//});

// URL del archivo que deseas descargar
let urlArchivo = 'https://www.ejemplo.com/archivo.pdf';

// Nombre con el que se guardará el archivo descargado
const nombreArchivoDescargado = 'archivo_descargado.jpg';

// Realizar la solicitud HTTP para descargar el archivo


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "sessionss",
    }),
    puppeteer: {
        // puppeteer args here
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    //NO ES NECESARIO PERO SI QUIERES AGREGAS UN console.log
    //sessionData = session;
    //fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    //    if (err) {
    //        console.error(err);
    //    }
    //});
});
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})


const send_message = [
    "54123456789",
    "54123456789"
]

client.on("ready", () => {
    console.log("Listo")

    send_message.map(value => {
        const chatId = value +"@c.us"
        message = "prueba 1"
        client.sendMessage(chatId,message);
})})

client.on('message', async (msg) => {
    if(msg.body === '!validacion'){
        let Admin = false;
        Admin = await esAdmin(msg);
        if(Admin){
            console.log(msg);
            const myString = JSON.stringify(msg).replace(/\,/g, ',\n\n');
            msg.reply(myString);
            console.log(msg.id.participant)
        } else msg.reply('Comando restringido a administradores')
        
    }
})

client.on('message', async (msg) => {
    if (msg.body === '!everyone') {
        const chat = await msg.getChat();
        //console.log(chat.id.user)
        let user = await msg.getContact();
        //console.log(user.id.user)
        let profilePicture = await user.getProfilePicUrl();
        if(chat.isGroup){
            if((chat.id.user == '51943297699-1622310081')){
                if((user.id.user == '5492612071333') || (user.id.user == '5492615941303') || (user.id.user == '51943297699')){
                    let text = "Prendemos stream gentee \n\n";
                    let mentions = [];
                    for (let participant of chat.participants) {
                    mentions.push(`${participant.id.user}@c.us`);
                    text += `@${participant.id.user} `;
                }
                await chat.sendMessage(text, { mentions });
            }
        } else if (((chat.id.user != '51943297699-1622310081'))){
            let text = " ";
                    let mentions = [];
                    for (let participant of chat.participants) {
                    mentions.push(`${participant.id.user}@c.us`);
                    text += `@${participant.id.user} `;
                }
                await chat.sendMessage(text, { mentions });
            }
        } else msg.reply('El comando solo esta disponible en un grupo.')
        
        
    
    }
});

client.on('message', async (msg) =>{
    if (msg.body == '!soysub'){
        const chat = await msg.getChat();
        if(!chat.isGroup){
        msg.reply('Para verificar que seas subscriptor, sigue los pasos a continuacion:\n\nEnvia una captura de tu suscripcion junto al comando \n!verificar\n\nNuestros moderadores verificaran si eres suscriptor y te agregarán al grupo de whatsapp.')
    }
}
})

client.on('message', async (msg) => {
    if (msg.body == '!commands'){
        
        msg.reply('Estos son los comandos disponibles actualmente 😉\n\n!sticker:\nEnvia una foto con !sticker en la descripcion para convertirlo en sticker\n\n!everyone:\nEtiqueta a todos los participantes del grupo (solo owner)\n\n!validacion:\n(experimental solo admin)\n\n!device:\nverifica si tienes android o ios\n\n!rol:\nPermite identificar tu rol en el grupo')
    }
});

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