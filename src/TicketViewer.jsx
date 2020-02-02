
import React from 'react';
import PropTypes from "prop-types";
import './TicketViewer.css';
import Button from '@material-ui/core/Button';

const Resolved = ({deleteTicket, selectedTicketId}) => {
    const handlePressed = () => {
        return deleteTicket({selectedTicketId})
    }

    return (
        <Button className="resolved-btn" onClick={handlePressed} variant="contained" color="primary">
            Resolved!
        </Button>
    );
}

const TicketViewer = ({tickets, selectedTicketId, deleteTicket}) => {

    
    
    return (
        <div className="ticket-viewer-js">
            <div className="top-toolbar">
                <p className="from">From: {tickets[selectedTicketId].name}</p>
                <p className="title">Subject: {tickets[selectedTicketId].title}</p>
                
            </div>
            <div className="center-view">

                    <div className="message">
                        <div className="TicketViewer-msg">
                            Description: 
                        </div>
                        <div>
                            {tickets[selectedTicketId].description}
                        </div>
                    </div>
            </div>
            <div className="bottom-toolbar">
                <div className="resolved-btn">
                    <Resolved deleteTicket={deleteTicket} selectedTicketId={selectedTicketId}/>
                </div>
            </div>

        </div>
    )
}


TicketViewer.propTypes = {
    selectedTicketId: PropTypes.number
}

export default TicketViewer;