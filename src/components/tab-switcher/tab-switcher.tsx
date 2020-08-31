import React from "react";
import styled from "styled-components";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

type TabSwitcherProps = {
  tabs: string[];
  value: number;
  setValue: (_: number) => void;
};

export function TabSwitcher({ tabs, value, setValue }: TabSwitcherProps) {
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
          {tabs.map((tab, index) => (
            <Tab key={tab} label={tab} {...a11yProps(index)} />
          ))}
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
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  indicator: {
    backgroundColor: "#ee6352",
  },
}));

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;
