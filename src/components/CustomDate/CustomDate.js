import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from "prop-types";
import classNames from "classnames";
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";

import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";

const useStyles = makeStyles(styles);

export default function CustomDate(props) {
  const classes = useStyles();
  const {
    formControlProps,
    labelText,
    id,
    error,
    success,
      selectedDate,
    onDateChange,
  } = props;

  const handleDateChange = (date) => {
    if (typeof onDateChange === "function") {
      onDateChange(date);
    }
  };

  return (
   
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
         <FormControl
      {...formControlProps}
      className={classNames(formControlProps.className, classes.formControl)}
    >
        
        <KeyboardDatePicker
          id={id}
          margin="normal"
          label={labelText}
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.datePicker}
        />
        {error ? (
          <Clear className={classNames(classes.feedback, classes.labelRootError)} />
        ) : success ? (
          <Check className={classNames(classes.feedback, classes.labelRootSuccess)} />
        ) : null}
        </FormControl>
      </MuiPickersUtilsProvider>
    
  );
}

CustomDate.propTypes = {
  labelText: PropTypes.node,
  id: PropTypes.string,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  rtlActive: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func,
};
