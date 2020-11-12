import React, { Component } from 'react';
import { Card, CardHeader } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

const shifts = ["Day", "Night", "Swing"]
const permissions = ["Admin", "Basic", "Manager"]
const colors = ["red", "blue", "green", "purple", "yellow", "orange"]
const departments = ["Engineering", "Sales", "HR"]
const url = 'http://localhost:8000/api/users/';
/**
 * provides a form for filling out a new user.
 * on submit it will send a post to the local db.
 */
class NewUser extends Component{
  constructor(props){
    super(props);
    this.state = {
      emailaddress: "",
      phonenumber: "",
      name: "",
      address: "",
      color: "",
      shift: "",
      department: "",
      permission: "",
      manager: "",
      position: "",
      photoFile:{},
      redirect:false

    }
  }

  /**
   * helps us update the photoFile state to whatever file the user
   * picks
   * @param {Event} e allows us to grab the file the user chooses 
   */
  uploadPhoto = (e) => {
    const files = Array.from(e.target.files)
    this.setState({ photoFile: files[0]})
  }
  /**
   * Provides us a way to handle the form data the user
   * enters.
   * @param {Event} event basic onSubmit for form event
   */
  handleSubmit = (event) => {

    event.preventDefault();
    
    const formData = new FormData()
    const data = {address: this.state.address, color: this.state.color, department: this.state.department, 
      emailaddress: this.state.emailaddress, end: "0001-01-01", history: "[]", manager: this.state.manager, 
      name: this.state.name, permissions: this.state.permission, phonenumber: this.state.phonenumber, 
      photo: this.state.photoFile, position: this.state.position, shift: this.state.shift, start: moment().format("YYYY-DD-MM"),
      status: "Employed"};
    
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }

    axios
      .post(url, formData)
      .then(res=>this.setState(()=>({redirect:true}))) 
      .catch(err=>console.log(err));
    }
  /**
   * render the components
   */
  render(){
    //after the onSubmit function runs, we want to redirect
    //back to the team member page.
    if (this.state.redirect) {
      return <Redirect to="/teammembers" />
    }
    return (
    
      <div>
      <div className="view-header">
        <Card className="view-title">
            <CardHeader title={"New User"}></CardHeader>
        </Card>
      </div>
      <div className="compact-view">
      <form onSubmit={this.handleSubmit}>
        <h1>Create New User</h1>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={this.state.name}
            onChange={e => this.setState(()=> ({name: e.target.value}))}
            required />
        </label>

        <label>
          Email Address
          <input
            name="emailaddress"
            type="email"
            value={this.state.emailaddress}
            onChange={e => this.setState(()=> ({emailaddress: e.target.value}))}
            required />
        </label>

        <label>
          Address
          <input
            name="address"
            type="address"
            value={this.state.address}
            onChange={e => this.setState(()=> ({address: e.target.value}))}
            required />
        </label>

        <label>
          Phone Number
          <input
            name="phonenumber"
            type="text"
            value={this.state.phonenumber}
            onChange={e => this.setState(()=> ({phonenumber: e.target.value}))}
            required />
        </label>
        <label>
          Position
          <input
            name="position"
            type="text"
            value={this.state.position}
            onChange={e => this.setState(()=> ({position: e.target.value}))}
            required />
        </label>
      
        <label>
          Manager
          <input
            name="manager"
            type="text"
            value={this.state.manager}
            onChange={e => this.setState(()=> ({manager: e.target.value}))}
            required />
        </label>
        <label>
          Photo Upload
          <input
            name="photoupload"
            type="file"
            accept="image/*"
            onChange={this.uploadPhoto}
            required />
        </label>
        <label>
          Permission
          <select
            name="permission"
            value={this.state.permission}
            onChange={e => this.setState(()=> ({permission: e.target.value}))}
            required>
            <option key=""></option>
            {permissions.map(permission => (
              <option key={permission}>{permission}</option>
            ))}
          </select>
        </label>
            
        <label>
          Shift
          <select
            name="shift"
            value={this.state.shift}
            onChange={e => this.setState(()=> ({shift: e.target.value}))}
            required>
            <option key=""></option>
            {shifts.map(shift => (
              <option key={shift}>{shift}</option>
            ))}
          </select>
        </label>
            
        <label>
          Department
          <select
            name="department"
            value={this.state.department}
            onChange={e => this.setState(()=> ({department: e.target.value}))}
            required>
            <option key=""></option>
            {departments.map(department => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </label>
            
        <label>
          Favorite Color
          <select
            name="color"
            value={this.state.color}
            onChange={e => this.setState(()=> ({color: e.target.value}))}
            required>
            <option key=""></option>
            {colors.map(color => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </label>

        <button className="formButton">Submit</button>
      </form>
      </div>
      </div>
    );  
  }
} 
export default NewUser;
