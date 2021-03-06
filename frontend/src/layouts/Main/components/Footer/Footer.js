import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Typography, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Footer = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography variant="body1">
        &copy;{" "}
        <Link component="a" href="#" target="_blank">
          Scope Security{" "}
        </Link>
        {new Date().getFullYear()}
      </Typography>
      <Typography variant="caption">
        Created with ❤ by{" "}
        <Link
          href="https://priyanshvatsal.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Priyansh&nbsp;
        </Link>
        <Link
          href="http://ayushk.dx.am"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ayush
        </Link>
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
