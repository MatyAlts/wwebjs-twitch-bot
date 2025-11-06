exports.eventHandlers = function (client) {
    console.log('📋 Cargando event handlers...');
    
    // Listener de mensajes - Solo comando !everyone-massive
    client.on('message', async (msg) => {
        try {
            // Comando: !everyone
            if (msg.body === '!everyone' || msg.body === '!todos') {
                const chat = await msg.getChat();
                const user = await msg.getContact();
                
                try {
                    let isAdmin = false;
                    if (chat.isGroup) {
                        const participant = chat.participants.find(p => p.id.user === user.id.user);
                        isAdmin = participant && participant.isAdmin;
                    }
                    
                    if (!isAdmin) {
                        await msg.reply('❌ Solo los administradores pueden usar este comando');
                        return;
                    }
                    
                    const participants = chat.participants;
                    const chunkSize = 100;
                    const delayBetweenChunks = 2000;
                    const chunks = [];
                    
                    for (let i = 0; i < participants.length; i += chunkSize) {
                        chunks.push(participants.slice(i, i + chunkSize));
                    }
                    
                    await msg.reply(`🚀 Iniciando mención masiva para ${participants.length} miembros en ${chunks.length} mensajes.`);
                    
                    for (let i = 0; i < chunks.length; i++) {
                        if (i > 0) await new Promise(resolve => setTimeout(resolve, delayBetweenChunks));
                        
                        let text = i === 0 ? "🔴 ¡STREAM EN VIVO! 🎮\n\n" : `📢 Parte ${i + 1}/${chunks.length}:\n\n`;
                        let mentions = [];
                        
                        for (let participant of chunks[i]) {
                            mentions.push(`${participant.id.user}@c.us`);
                            text += `@${participant.id.user} `;
                        }
                        
                        await chat.sendMessage(text, { mentions });
                        console.log(`✅ Chunk ${i + 1}/${chunks.length} enviado`);
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await msg.reply(`✅ Mención masiva completada!`);
                    await chat.sendMessage('kick.com/teosilvas');
                } catch (error) {
                    console.error('Error en mención masiva:', error);
                    await msg.reply('❌ Error crítico en la mención masiva.');
                }
            }
            
        } catch (error) {
            console.error('❌ Error en el handler de mensajes:', error);
        }
    });
    
    console.log('✅ Event handlers cargados correctamente - Solo comando !everyone-massive activo');
};
