console.log('Escritorio HTML');

const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const asesoria      = document.querySelector('#asesoria');
const reclamaciones = document.querySelector('#reclamaciones');
const devolucion    = document.querySelector('#devolucion');
const otros         = document.querySelector('#otros');

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
        if(pendientes === 0){
            lblPendientes.style.display = 'none';
        } else {
            lblPendientes.style.display = '';
            lblPendientes.innerText = pendientes;
        }    
    })

socket.on('tickets-asesoria', (pendientes) => {
    if (pendientes === 0) {
        asesoria.innerText = '0';
    } else {
        asesoria.innerText = pendientes;
    }
})

socket.on('tickets-reclamaciones', (pendientes) => {
    if (pendientes === 0) {
        reclamaciones.innerText = '0';
    } else {
        reclamaciones.innerText = pendientes;
    }
})
socket.on('tickets-devolucion', (pendientes) => {
    if (pendientes === 0) {
        devolucion.innerText = '0';
    } else {
        devolucion.innerText = pendientes;
    }
})
socket.on('tickets-otros', (pendientes) => {
    if (pendientes === 0) {
        otros.innerText = '0';
    } else {
        otros.innerText = pendientes;
    }
})


btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        if(!ok){
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        } 

        lblTicket.innerText = 'Ticket ' + ticket.numero;
           
    });

});