import React from "react";
import PropTypes from "prop-types";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import "./TicketViewer.css";

function Ticket({id, ticket}) {
    return (
        <div className="ticket">
                <div> <b> Subject:  {ticket.title} </b></div>
                <div>Sender: {ticket.name}</div>
            <div className="priority-div"> Priority: {ticket.priority}</div>
            <ShowChartIcon className="priority-icon" />
        </div>
    )
}

Ticket.propTypes = { 
    // id: PropTypes.number.isRequired,
    ticket: PropTypes.object,
    read: PropTypes.string.isRequired,
    resolved: PropTypes.bool
    
};

export default Ticket;
