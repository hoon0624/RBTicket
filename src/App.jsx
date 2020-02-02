import React, {useState, useEffect} from 'react';
import './App.css';
import Axios from "axios";
import Ticket from "./Ticket";
import Sidebar from "./Sidebar";
import TicketViewer from "./TicketViewer"
import NavBar from './NavBar';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {Fab, Action} from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import {ReactComponent as Add} from "./add.svg"

const EmailButton = ({position, handleEmailOnClick, handleHelpOnClick}) => {
    return (
         <Fab
         className="special-fab"
        position={position}
        icon={<Add />}
        event={"hover"}
        >
          <Action
              text="Email"
              onClick={handleEmailOnClick}
          />
          <Action
              text="Help"
              onClick={handleHelpOnClick}
              >
              <i className="fa fa-help" />
          </Action>
        </Fab>
    );
}

EmailButton.propTypes = {
    position: PropTypes.object,
    handleEmailOnClick: PropTypes.func,
    handleHelpOnClick: PropTypes.func
}

 const App = ({db}) => {
  
  const [selectTicketId, setTicketId] = useState(0);
  const [show, setShow] = useState(false);
  const [isLoading, SetLoaded] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  var [tickets, setTickets] = useState([]);

  // initialValue.push(...allowedState);
  // ****** BEGINNING OF CHANGE ******
  

  const toggleDiv = () => {
    const {show} = this.state.show;
    this.setState({ show : !show})
  }

  const deleteTicket = ({selectedTicketId}) => {
    console.log(`${selectTicketId} deleted`);
    console.log(tickets[selectedTicketId])
    tickets[selectedTicketId].resolved = true;
  }


  const handleEmail = () => {

  };

  const handleHelp = () => {

  };

  const handleDelete = () => {

  };
    
  const openTicket = (id) => {
    const index = tickets.findIndex(x => x.id === id)
    setTicketId(index)
  }

  const getTickets = async () => {
    db.collection('tickets').onSnapshot((querySnapshot) => {
      SetLoaded(true)
      setTickets(prevState => 
        []
      );
      var count = 0;
      querySnapshot.forEach((doc) => {
          if(!tickets.map(x => x.doc_id).includes(doc.id)) {
              setTickets(prevState => 
                [ ...prevState, {...doc.data(), id: count}]
              );
              count += 1;
          }
      }
      );
      SetLoaded(false)
    })

    const response = await db.collection("tickets").get().then((snapshot) => {
        SetLoaded(false);
      })
  }

  if(isLoading & !loadingData) {
    setLoadingData(true);
    getTickets();
    return null;
  }
  return ( 
    <section className="body-container"> 
    <EmailButton position={{left: 1300, bottom: 0}} handleEmailOnClick={handleEmail} handleHelpOnClick={handleHelp}/>
     <div className="nav-bar">
          <NavBar />
    </div>
    {isLoading ? (
      <div className="loader">
        <span className="loader__text">Loading...</span>
      </div>
    ) : (
      <div className="react-tix">
        <div className="ticketLists">
          <Sidebar tickets={tickets} openTicket={openTicket} />
        </div>
        <div className="ticket-viewer">
          <TicketViewer tickets={tickets} selectedTicketId={selectTicketId} deleteTicket={deleteTicket}/>
        </div>
        
      </div>
    )}
    </section>
  );
}

App.propTypes = {
  db: PropTypes.object
}

export default App;
