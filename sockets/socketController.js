const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    console.log('Cliente conectado', socket.id);
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.emit('tickets-asesoria', ticketControl.tickets.length);
    socket.emit('tickets-reclamaciones', ticketControl.tickets.length);
    socket.emit('tickets-devolucion', ticketControl.tickets.length);
    socket.emit('tickets-otros', ticketControl.tickets.length);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });

    socket.on('siguiente-ticket', (payload, callback) => {
        console.log('⚠️ ->  siguiente-ticket', payload);

        const siguiente = ticketControl.siguiente(payload);
        callback(siguiente);

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-asesoria', ticketControl.asesoria.length);
        socket.broadcast.emit('tickets-reclamaciones', ticketControl.reclamaciones.length);
        socket.broadcast.emit('tickets-devolucion', ticketControl.devolucion.length);
        socket.broadcast.emit('tickets-otros', ticketControl.otros.length);
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        socket.emit('tickets-asesoria', ticketControl.asesoria.length);
        socket.broadcast.emit('tickets-asesoria', ticketControl.asesoria.length);

        socket.emit('tickets-reclamaciones', ticketControl.reclamaciones.length);
        socket.broadcast.emit('tickets-reclamaciones', ticketControl.reclamaciones.length);

        socket.emit('tickets-devolucion', ticketControl.devolucion.length);
        socket.broadcast.emit('tickets-devolucion', ticketControl.devolucion.length);

        socket.emit('tickets-otros', ticketControl.otros.length);
        socket.broadcast.emit('tickets-otros', ticketControl.otros.length);
        
        if(!ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket: ticket
            });
        }
        
    });
    
};

module.exports = {
    socketController
}