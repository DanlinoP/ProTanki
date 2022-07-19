const net = require('net');
const config  = require("./config.json") 

const server = net.createServer();
server.listen(config.port, config.ip, () => {
    console.log('Servidor rodando na porta ' + config.port + '.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('Nova conexão [' + sock.remoteAddress + '] ' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', async function(data) {
        data = await decryptText(data.toString())
        console.log('Recebido [' + sock.remoteAddress + '] ' + data);
        
        // COMPARTILHAR DADOS DE UM CLIENTE COM TODOS // APENAS EXEMPLO DE CHAT POR EXEMPLO
        // sockets.forEach(function(sock, index, array) {
        //     sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        // });
    });

    // Remover cliente quando desconectado
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('Encerrou [' + sock.remoteAddress + '] ' + sock.remotePort);
    });
});

async function decryptText(data){
    var key = parseInt(data[0])
    var data = data.slice(1).split('end~')[0].split('')
    var ndata = ""
    data.forEach(element => {
        ndata += String.fromCharCode(element.charCodeAt(0)-key-1)
    });
    return ndata
}