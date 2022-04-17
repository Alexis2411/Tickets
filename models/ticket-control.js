const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio, categoria, color) {
        this.numero = numero;
        this.escritorio = escritorio;
        this.categoria = categoria;
        this.color = '#' + color;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];
        this.asesoria = [];
        this.reclamaciones = [];
        this.devolucion = [];
        this.otros = [];

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
            asesoria: this.asesoria,
            reclamaciones: this.reclamaciones,
            devolucion: this.devolucion,
            otros: this.otros
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4, asesoria, reclamaciones, devolucion, otros } = require('../db/data.json');

        if (hoy == this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
            this.asesoria = asesoria;
            this.reclamaciones = reclamaciones;
            this.devolucion = devolucion;
            this.otros = otros
        } else {
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente(payload) {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null, payload.categoria, payload.color);
        this.tickets.push(ticket);

        if (payload.categoria == 'Asesoría') {
            this.asesoria.push(ticket);
        }

        if (payload.categoria == 'Reclamaciones') {
            this.reclamaciones.push(ticket);
        }

        if (payload.categoria == 'Devolución de productos o servicios') {
            this.devolucion.push(ticket);
        }

        if (payload.categoria == 'Otros') {
            this.otros.push(ticket);
        }

        console.log("Tickets:       " + this.tickets.length);
        console.log("Asesoria:      " + this.asesoria.length);
        console.log("Reclamaciones: " + this.reclamaciones.length);
        console.log("Devolucion:    " + this.devolucion.length);
        console.log("Otros:         " + this.otros.length);

        this.guardarDB();

        return 'Ticket: ' + ticket.numero;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length == 0) {
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        if (ticket.categoria == 'Asesoría') {
            this.asesoria.shift();
        }
        if (ticket.categoria == 'Reclamaciones') {
            this.reclamaciones.shift();
        }

        if (ticket.categoria == 'Devolución de productos o servicios') {
            this.devolucion.shift();
        }

        if (ticket.categoria == 'Otros') {
            this.otros.shift();
        }

        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1);
        }

        console.log("Ticket atendido:           "+ ticket.numero +" "+ ticket.categoria)
        console.log("Tickets Restantes:         " + this.tickets.length);
        console.log("Asesoria:                  " + this.asesoria.length);
        console.log("Reclamaciones:             " + this.reclamaciones.length);
        console.log("Devolucion:                " + this.devolucion.length);
        console.log("Otros:                     " + this.otros.length);

        this.guardarDB();

        return ticket;
    }

}

module.exports = TicketControl;