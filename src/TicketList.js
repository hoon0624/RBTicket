import React from "react";
import Ticket from "./Ticket";

// var ticketlist;

// module.exports = {ticketlist};

function TicketList({tickets}) {
    var ticket_list = tickets( (ticket) => {
        return (
            <Ticket key={ticket.id}
                    id={ticket.id}
                    from={ticket.from}
                    read={ticket.read}
                    time={ticket.time}
            />
        );
    })
    // ticketli /st = ticket_list;

    return (
        <table>
            <thead>
                <tr>
                    <th>From</th>
                    <th>Subject</th>
                </tr>
            </thead>
            <tbody>
                {ticket_list}
            </tbody>
        </table>
    );
}

export default TicketList;