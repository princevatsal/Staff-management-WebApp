import React, { useState, useContext } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { UserContext } from "context/userContext";
import mockData from "./data";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  content: {
    padding: 0,
  },
  image: {
    height: 48,
    width: 48,
  },
  actions: {
    justifyContent: "flex-end",
  },
}));

//filter locations by given Date
const filterLocs = (tasklist, finaldate) =>
  tasklist.filter((task) => {
    let today = finaldate.toLocaleDateString();
    let date = new Date(Number(task.date)).toLocaleDateString();
    if (today === date) return true;
  });
const LatestProducts = (props) => {
  const { dates } = useContext(UserContext);
  const { className, userActivity, ...rest } = props;

  var list = [];
  Object.keys(userActivity).forEach((key) => {
    let date = new Date(Number(key));
    let str = date.toLocaleString();
    list.push({
      str,
      lat: userActivity[key].geo.lat,
      long: userActivity[key].geo.long,
      date: date,
    });
  });
  list = filterLocs(list, dates.date);
  const classes = useStyles();

  const [products] = useState(mockData);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader subtitle={`${products.length} in total`} title="Locations" />
      <Divider />
      <CardContent className={classes.content}>
        <List>
          {list.map((product, i) => (
            <a
              href={`https://www.google.com/maps/place/${product.lat},${product.long}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItem divider={i < products.length - 1} key={product.id}>
                <ListItemAvatar>
                  <img
                    alt="Product"
                    className={classes.image}
                    src={"images/location.png"}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={product.str}
                  secondary={`lat:${product.lat} long:${product.long}`}
                />
                <IconButton edge="end" size="small">
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            </a>
          ))}
        </List>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        {/* <Button color="primary" size="small" variant="text">
          View all <ArrowRightIcon />
        </Button> */}
      </CardActions>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string,
};

export default LatestProducts;
