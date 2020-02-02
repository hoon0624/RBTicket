import React, {useState, useEffect} from 'react';
import './App.css';
import Axios from "axios";
import Ticket from "./Ticket";
import Sidebar from "./Sidebar";
import TicketViewer from "./TicketViewer"
import NavBar from './NavBar';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';


 const App = ({db}) => {
  
  const [selectTicketId, setTicketId] = useState(0);
  const [show, setShow] = useState(false);
  const [isLoading, SetLoaded] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  var [tickets, setTickets] = useState([]);

  const toggleDiv = () => {
    const {show} = this.state.show;
    this.setState({ show : !show})
  }

  const handleDelete = () => {
      const ticket = tickets[selectTicketId]
      let ref = db.collection('tickets').doc(ticket.doc_id).delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
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
  if(tickets.length == 0) {
    return (
      <section className="body-container">
            <div className="nav-bar">
              <NavBar />
            </div>
      </section> 
            )
  }
  return ( 
    <section className="body-container"> 
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
              <TicketViewer tickets={tickets} selectedTicketId={selectTicketId} handleDelete={handleDelete}/>
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
