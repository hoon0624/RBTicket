
import React from 'react';
import PropTypes from "prop-types";
import './TicketViewer.css';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';


const TicketViewer = ({tickets, selectedTicketId, deleteTicket, handleDelete, handleEmail}) => {

    const ticket = tickets[selectedTicketId];

    return (
        <div className="ticket-viewer-js">
            <div className="top-toolbar">
                <div className="top-box-top-toolbar">
                    <div className="top-box-top-toolbar-content">
                        <p className="from">From: {ticket.name} - {ticket.email} </p>
                        <p className="title">Subject: {ticket.title}</p>
                    </div>
                </div>
                <div className="bottom-box-top-toolbar">
                    <p className="from">Date: {ticket.date}</p>
                    <p className="title">Type: {ticket.problem}</p>
                    <p className="title">Team: {ticket.team}</p>
                </div>
            </div>
            <div className="center-view">
                    <div className="message">
                        <div className="TicketViewer-msg">
                            Description: 
                        </div>
                        <div>
                        {ticket.description}
                        </div>
                    </div>
            </div>
            <div className="bottom-toolbar">
                <div className="left-bottom-toolbar">
                    <div className="resolved-btn" >
                        <Button onClick={handleDelete} className="resolved-btn" size="large" color="#2980b9;" onClick={handleDelete} variant="contained">
                            Resolved
                        </Button>
                    </div>
                </div>
                <div className="delete-btn">
                    <Button size="large" onClick={handleDelete} variant="contained" variant="contained" color="secondary" startIcon={<DeleteIcon />}> 
                        Delete
                    </Button>
                </div>
            </div>
            <div className="separator"></div>
        </div>
    )
}


TicketViewer.propTypes = {
    selectedTicketId: PropTypes.number,
    handleDelete: PropTypes.func,
    handleEmail: PropTypes.func,

}

export default TicketViewer;