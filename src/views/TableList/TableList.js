import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.9)",
      margin: "0",
      fontSize: "14px",
      fontWeight: "300",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#7778",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>SIMPATIZANTES</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de simpatizantes registrados.
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="info"
              tableHead={["NOMBRE","A.PATERNO","A.MATERNO","EDAD","SEXO","CIUDAD","MUNICIPIO","cp" ,"TELEFONO", "EMAIL"]}
              tableData={[
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
                ["JOSE", "PASTOR","CARDENAS","32","H","COLIMA","COLIMA","28020","31214226....","jpastor...@gmail.com"],
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
     {/* <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="info">
            <h4 className={classes.cardTitleWhite}>
              Table on Plain Background
            </h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="info"
              tableHead={["ID", "Name", "Country", "City", "Salary"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park",
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten",
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"],
              ]}
            />
          </CardBody>
        </Card>
            </GridItem>*/}
    </GridContainer>
  );
}
