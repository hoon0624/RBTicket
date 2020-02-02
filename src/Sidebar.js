import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { render } from '@testing-library/react';
import Ticket from './Ticket'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    // maxWidth: 300,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
}));

const RenderRow = ({ticket, openTicket }) =>  {
  const handleOpen = () => {
    return openTicket(ticket.id)
  }
  return (
    <ListItem className="ticket" button onClick={handleOpen} key={ticket.id}>
         <Ticket ticket={ticket}/>
    </ListItem>
  );
}

RenderRow.propTypes = {
  ticket: PropTypes.object,
  openTicket: PropTypes.func,
};

const Sidebar = ({tickets, openTicket }) => {
  const classes = useStyles();
  if(tickets) {
    return (
        <div className={classes.root}>
            <div>
              {
                 tickets.map( ticket => {
                    return (<RenderRow ticket={ticket} openTicket={openTicket} />)
                 })
              }
            </div>
        </div>
      );
  } else {
      console.log("failed...");
      return null;
  }
}

Sidebar.propTypes = {
    tickets: PropTypes.array,
    openTicket: PropTypes.func
}

export default Sidebar;
