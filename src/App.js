import React from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from "axios";
import Ticket from "./Ticket";
import TicketList from "./TicketList";
import Sidebar from "./Sidebar";


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

class App extends React.Component {
  state={
    isLoading: true,
    tickets: [],
    selectedTicketId: 0,
    show: false
  }
  
  // getTickets = async() => {
  //   const {
  //     data: {tickets}
  //   } = await Axios.get("https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json");
  //   this.setState({ tickets, isLoading: false });
  // };

  toggleDiv = () => {
    const {show} = this.state.show;
    this.setState({ show : !show})
  }

  openTicket(id) {
    const tickets = this.state.tickets;
    const index = tickets.findIndex(x => x.id === id);
    tickets[index].read = 'true';
    this.setState({
      selectedTicketId: id,
      tickets
    });
  }

  async getTickets() {
    const {data: tickets}= await Axios.get("https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json");
    console.log(tickets);
    this.setState({tickets, isLoading: false});
  }

  componentDidMount() {
    this.getTickets();
  }

  render() {
    const { isLoading, tickets } = this.state;

    return ( 
      <section className="container"> 
      {isLoading ? (
        <div className="loader">
          <span className="loader__text">Loading...</span>
        </div>
      ) : (
        <div className="react-tix">
          <div className="tickets">
            {tickets.map(ticket => (
              <Ticket 
                key={ticket.id}
                id={ticket.id}
                from={ticket.from}
                message={ticket.message}
                read={ticket.read}
              />
            ))}
          </div>

          <div className="ticketLists">
            <Sidebar tickets={tickets}/>
          </div>


        </div>
        
      )}
      </section>
    );
  }
}

export default App;
