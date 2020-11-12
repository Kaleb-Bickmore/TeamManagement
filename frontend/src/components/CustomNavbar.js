import React, {Component} from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Navbar for switching between routes
 */
class CustomNavbar extends Component{
    constructor(props){
        super(props);     
    }
    /**
     * render the components
     */
    render(){
        const { location } = this.props;
        return(<Navbar bg="light" expand="lg">
        <Navbar.Brand href="/" to="/">
            <img
            src="/logo.png"
            width="190"
            height="70"
            className="d-inline-block align-top"
            alt="logo"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav activeKey={location.pathname} className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/teammembers">Team Members</Nav.Link>
            <Nav.Link href="/permissions">Permissions</Nav.Link>
        </Nav>
        </Navbar.Collapse>
        </Navbar>);
    }
};
CustomNavbar.propTypes = {
    active: PropTypes.string
}
CustomNavbar.defaultProps = {
    active: "home"
}

export default CustomNavbar;