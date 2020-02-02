import React from "react";
import PropTypes from "prop-types";

function Ticket({id, from, message, read}) {
    return (
        <div className="ticket">
            <dl className="meta dl horizontal">
                <dt>From</dt>
                <dd>{from}</dd>

                <dt>Subject</dt>
                <dd>{message}</dd>
            </dl>
            
        </div>
    )
}

Ticket.propTypes = { 
    // id: PropTypes.number.isRequired,
    from: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    read: PropTypes.string.isRequired,
    
};

export default Ticket;
