import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    // maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

// const renderRow = ({tickets}) => {
//   return tickets.map(ticket => (
//      <ListItem primaryText={ticket.from} key={ticket.id} />
//   ))}

// function renderRow(props) {
//   const { index, style } = props;
//   return (
//     <ListItem button style={style} key={index}>
//       <ListItemText primary={`Item ${index + 1}`} />
//     </ListItem>
//   );
// }

const renderRow = ({tickets}) => {
  return (
    tickets.map(ticket => {
      if(ticket) {
        return (
          <ListItem button style primaryText={ticket.from} key={ticket.id}/>
        );
      } 
      else {
        console.log("error");
      }
    })
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

const VirtualizedList = ({tickets}) => {
  const classes = useStyles();
  if(tickets) {
    return (
        <div className={classes.root}>
        <FixedSizeList height={800} width={300} itemSize={70} itemCount={tickets.length}>
            <renderRow ticket={tickets} /> 
        </FixedSizeList>
        </div>
      );
  } else {
      return null;
  }
}

VirtualizedList.propTypes = {
    tickets: PropTypes.array
}

export default VirtualizedList;
