exports.esAdmin = async function (msg){
    cliente = await msg.getContact();
    chat = await msg.getChat();
    if(chat.isGroup){
        const clienteEnGrupo = chat.participants.find(chatObj => chatObj.id.user === cliente.id.user)
        if(clienteEnGrupo.isAdmin){
            return true;
        }
        else return false;
    }
    
}

exports.strMes = function (mes) {
    if (mes > 0 && mes < 13){
        switch(mes){
            case 1: return 'Enero';
            case 2: return 'Febrero';
            case 3: return 'Marzo';
            case 4: return 'Abril';
            case 5: return 'Mayo';
            case 6: return 'Junio';
            case 7: return 'Julio';
            case 8: return 'Agosto';
            case 9: return 'Septiembre';
            case 10: return 'Octubre';
            case 11: return 'Noviembre';
            case 12: return 'Diciembre';
        }
    } else{
        return undefined
    }
}
