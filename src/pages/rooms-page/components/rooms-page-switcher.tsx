import React from "react";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

type RoomsPageSwitcher = {
  value: number;
  setValue: (_: number) => void;
};

export function RoomsPageSwitcher({ value, setValue }: RoomsPageSwitcher) {
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="simple tabs example"
          centered
          indicatorColor="secondary"
          classes={{
            indicator: classes.indicator,
          }}
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </div>
    </Container>
  );
}

const a11yProps = (index: Number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

/**
 * I haven't been able to figure out a way to do this in
 * a styled component. Material UI makes me sad, but it's pretty so 🤷🏿‍♂️
 */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  indicator: {
    backgroundColor: "#ee6352",
  },
}));

const Container = styled.div`
  max-width: 540px;
  margin: 0 auto;
`;
