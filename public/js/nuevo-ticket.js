console.log('Nuevo Ticket HTML');

const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('#btnNuevo');
const selector = document.querySelector('select');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = false;
});


socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
})


btnCrear.addEventListener( 'click', () => {
    var value = selector.value;

    const [ categoria, color ] = value.split('#');
    
    socket.emit( 'siguiente-ticket', { categoria, color }, ( ticket ) => {
        console.log('💁 Desde el server: ', ticket );
        lblNuevoTicket.innerText = ticket;
    });
    
});