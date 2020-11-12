import React, {Component} from 'react';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';

import axios from 'axios';
import moment from 'moment';

const url = 'http://localhost:8000/api/users/';
/**
 * Home class
 * provides a landing page to see basic stats about the
 * employees for HR
 */
  class Home extends Component {
    constructor(props){
      super(props);
      this.state={
        teamMembers:[]
      }
    }
    /**
     * renders the stats for the departments card
     */
    calcDepartment(){
      let departmentEmployees={}
      this.state.teamMembers.forEach((row,index)=>{
        if(row.status!=="Terminated"){
        if(row.department in departmentEmployees){
          departmentEmployees[row.department]+=1
        }
        else{
        departmentEmployees[row.department]=1
        }
        }
      
      })
      const departmentArray = Object.keys(departmentEmployees).map(key => {
        var newObj={};
        newObj[key]=departmentEmployees[key];
        return newObj;
      });
        return(
        <div>

        {departmentArray.map((department,index)=>{
              return(
                <div>
                <Typography color="textSecondary" gutterBottom>
                  {Object.keys(department)[0]}
                </Typography>
                <Typography variant="h3" component="h2">
                  {department[Object.keys(department)[0]]}
                </Typography>
                </div>)
            })}
        </div>

      );
    }
    /**
     * renders the stats for the manager card
     */
    calcManager(){
      let managerEmployees={}
      this.state.teamMembers.forEach((row,index)=>{
        if(row.status!=="Terminated"){
        if(row.manager in managerEmployees){
          managerEmployees[row.manager]+=1
          }
        else{

        managerEmployees[row.manager]=1
        }
      }
      })
      const managerArray = Object.keys(managerEmployees).map(key => {
        var newObj={};
        newObj[key]=managerEmployees[key];
        return newObj;
      });
        return(
        <div>

        {managerArray.map((manager,index)=>{
              return(
                <div>
                <Typography color="textSecondary" gutterBottom>
                  {Object.keys(manager)[0]}
                </Typography>
                <Typography variant="h3" component="h2">
                  {manager[Object.keys(manager)[0]]}
                </Typography>
                </div>)
            })}
        </div>

      );

    }
    /**
     * renders the hiring stats. Uses moment.js to do week calculations
     * for hiring calculations
     */
    calcHires(){
      let count = 0;
      this.state.teamMembers.forEach((row,index)=>{
        var now = moment();
        var employeeDate = moment(row.start);
        console.log(now.isSame(employeeDate,'year'))
        console.log(employeeDate.isoWeek())
        console.log(now.isoWeek())

        if(employeeDate.isoWeek()==now.isoWeek()&& now.isSame(employeeDate,'year')){
          count+=1;
        }
      });
      return count;
    }
    /**
     * renders the hiring stats. Uses moment.js to do year calculations
     * for termination data
     */
    calcTerminations(){
      let count = 0;
      this.state.teamMembers.forEach((row,index)=>{
        var now = moment();
        var employeeDate = moment(row.end);
        if(now.isSame(employeeDate,'year')){
          count+=1;
        }
      });
      return count;
    }
    /**
     * get the team members once component is mounted.
     */
    componentDidMount(){
      axios
        .get(url)
        .then(res => this.setState({ teamMembers: [...res.data]}) )
        .catch(err => console.log(err));
    }
    /**
     * component rendering
     */
  render(){
    return (
      <div>
        <div className="view-header">
          <Card className="view-title">
            <CardHeader title={"Home"}></CardHeader>
          </Card>
        </div>
        <div className="compact-view">
          <Row className="mx-auto">
            <Col className="recruit-card" sm={12} md={6}>
              <Card className="text-center info-cards">
                <CardHeader title={"Hiring"}></CardHeader>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                   Weekly Hires
                  </Typography>
                  <Typography variant="h3" component="h2">
                    {this.calcHires()}
                  </Typography>
                </CardContent>
              </Card>
            </Col>
            <Col className="recruit-card" sm={12} md={6}>
              <Card className="text-center info-cards">
                <CardHeader title={"Terminations"}></CardHeader>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {moment().format('YYYY')} Terminations
                  </Typography>
                  <Typography variant="h3" component="h2">
                  {this.calcTerminations()}
                  </Typography>         
                </CardContent>        
              </Card>
            </Col>
          </Row>
          <Row className="mx-auto">
            <Col className="recruit-card" sm={12} md={6}>
              <Card className="text-center info-cards">
                <CardHeader title={"Departments"}></CardHeader>
                <CardContent>
                  <Typography variant="h5" component="h2">
                   Employee Numbers
                  </Typography>
                    {this.calcDepartment()}
                </CardContent>
              </Card>
            </Col>
            <Col className="recruit-card" sm={12} md={6}>
              <Card className="text-center info-cards">
                <CardHeader title={"Managers"}></CardHeader>
                <CardContent>
                  <Typography variant="h5" component="h2">
                  Employee Numbers
                  </Typography>
                  {this.calcManager()}
                </CardContent>        
              </Card>
            </Col>
          </Row> 
        </div>
      </div>
      
    );
  }
}
export default Home;

