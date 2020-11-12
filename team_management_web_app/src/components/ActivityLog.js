import React, { Component } from 'react';
import { Card, CardHeader } from '@material-ui/core';
import { Feed } from 'semantic-ui-react';
import { Col, Row } from 'react-bootstrap';

import axios from 'axios';

const url = 'http://localhost:8000/api/users/'
/**
 * Activity log for the user.
 */
class ActivityLog extends Component {
  constructor(props){
    super(props);
    this.state = {
      events:[]
    }
  }
  /**
   * get the team member data using the id in the location data.
   */
  componentDidMount(){
    axios
      .get(url+this.props.match.params.userid+"/")
      .then(res => this.setState({ events: [...JSON.parse(res.data.history)]}) )
      .catch(err => console.log(err));
  }
/**
 * render the feed.
 */
  render(){
    console.log(this.props)
    return (
      <div>
      <div className="view-header">
        <Card  className="view-title">
          <CardHeader title={"Activity Log"}></CardHeader>
        </Card>
        </div>
        <div className="activity-view">
         <Row>
           <Col  sm={12}>        
             <Feed events={this.state.events}/>
           </Col>
         </Row>
         </div>
      </div>
    );
  }
}

export default ActivityLog;



