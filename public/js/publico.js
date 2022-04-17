console.log('Público HTML')

const td1            = document.querySelector('#td1');
const lblTicket1     = document.querySelector('#lblTicket1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');
const td2            = document.querySelector('#td2');
const lblTicket2     = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const td3            = document.querySelector('#td3');
const lblTicket3     = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const td4            = document.querySelector('#td4');
const lblTicket4     = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');

const socket = io();

socket.on('estado-actual', (payload) => {

    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play();

    const [ ticket1, ticket2, ticket3, ticket4 ] = payload;

    if(ticket1) {
        lblTicket1.innerText     = 'Ticket ' + ticket1.numero;
        lblEscritorio1.innerText = ticket1.escritorio;
        td1.style.background     = ticket1.color;
    }

    if(ticket2) {
        lblTicket2.innerText     = 'Ticket ' + ticket2.numero;
        lblEscritorio2.innerText = ticket2.escritorio;
        td2.style.background     = ticket2.color;
    }

    if(ticket3) {
        lblTicket3.innerText     = 'Ticket ' + ticket3.numero;
        lblEscritorio3.innerText = ticket3.escritorio;
        td3.style.background     = ticket3.color;
    }

    if(ticket4) {
        lblTicket4.innerText     = 'Ticket ' + ticket4.numero;
        lblEscritorio4.innerText = ticket4.escritorio;
        td4.style.background     = ticket4.color;
    }

});