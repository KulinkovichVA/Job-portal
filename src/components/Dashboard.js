import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MyBoard from './MyBoard';
import JobList from './JobList';
import CoverLetterBuilder from './CoverLetterBuilder';
import { forwardRef, useImperativeHandle } from 'react';
import shortid from 'shortid';
import { useAuth0 } from '@auth0/auth0-react';
import './Dashboard.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {/* <Typography>{children}</Typography> */}
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

const Dashboard = forwardRef((props, ref) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [currentSearchedPage, setCurrentSearchedPage] = React.useState(1);
    const [currentSavedPage, setCurrentSavedPage] = React.useState(1);
    const [searchId, setSearchId] = React.useState(0);
    const { isAuthenticated } = useAuth0();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useImperativeHandle(ref, () => ({
        resetSearchedJobList() {
            setCurrentSearchedPage(1);
            setSearchId(shortid.generate());
        },
    }));

    return (
        <div className={classes.root} id="dashboard">
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    variant="fullWidth"
                    TabIndicatorProps={{ style: { background: '#bf55ec' } }}
                >
                    <Tab label="Browse all" {...a11yProps(0)} />
                    <Tab label="Saved" {...a11yProps(1)} />
                    <Tab label="Cover letter" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <JobList
                    key={searchId}
                    jobsArray={props.jobsArray}
                    jobStatus={props.jobStatus}
                    toggleJobInSavedJobs={props.toggleJobInSavedJobs}
                    currentPage={currentSearchedPage}
                    setCurrentPage={setCurrentSearchedPage}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                {isAuthenticated ? (
                    <MyBoard
                        savedJobsArray={props.savedJobsArray}
                        jobStatus={props.jobStatus}
                        toggleJobInSavedJobs={props.toggleJobInSavedJobs}
                        currentPage={currentSavedPage}
                        setCurrentPage={setCurrentSavedPage}
                    />
                ) : (
                    <h1 className="sign-in-alert">Please sign in</h1>
                )}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {isAuthenticated ? (
                    <CoverLetterBuilder savedJobsArray={props.savedJobsArray} />
                ) : (
                    <h1 className="sign-in-alert">Please sign in</h1>
                )}
            </TabPanel>
        </div>
    );
});

export default Dashboard;
