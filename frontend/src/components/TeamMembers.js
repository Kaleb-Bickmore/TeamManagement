import React, { Component } from 'react';
import { Tooltip } from '@material-ui/core';
import { Button, Card, CardContent, CardHeader } from '@material-ui/core';
import EdiText from 'react-editext'
import { Col, Row, Image } from 'react-bootstrap';
//icon imports
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import ColorLensIcon from '@material-ui/icons/ColorLens';
//end icon import
//table import
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type }  from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import axios from 'axios';
import moment from 'moment';
/*****************************/
//Constants
/*****************************/
const url = 'http://localhost:8000/api/users/';
const shiftOptions= [{
  value: 'Day',
  label: 'Day'
}, {
  value: 'Night',
  label: 'Night'
},
{
  value: 'Swing',
  label: 'Swing'
}];
const employeeStatus= [{
  value: 'Employed',
  label: 'Employed'
}, {
  value: 'Terminated',
  label: 'Terminated'
},
{
  value: 'TemporaryLeave',
  label: 'TemporaryLeave'
}];
const departments= [{
  value: 'Engineering',
  label: 'Engineering'
}, {
  value: 'Sales',
  label: 'Sales'
},
{
  value: 'HR',
  label: 'HR'
}];
/*****************************/
//Helper functions
/*****************************/
function dateFormatter(cell){
  let dateObj = cell;
  if (typeof cell !== 'object') {
    dateObj = new Date(cell);
  }
  return `${('0' + (dateObj.getUTCMonth() + 1)).slice(-2)}/${('0' + dateObj.getUTCDate()).slice(-2)}/${dateObj.getUTCFullYear()}`;
}
const sizePerPageRenderer = ({
  options,
  currSizePerPage,
  onSizePerPageChange
}) => (
  <div className="btn-group" role="group">
    {
      options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <button
            key={ option.text }
            type="button"
            onClick={ () => onSizePerPageChange(option.page) }
            className={ `btn ${isSelect ? 'btn-secondary' : 'btn-primary'}` }
          >
            { option.text }
          </button>
        );
      })
    }
  </div>
);
/**
 * 
 * @param {*} order order we want to sort
 * @param {*} column column we are sorting
 */
const sortCaret = (order, column) => {
  if (!order) return (<span><ArrowDropUpIcon/><ArrowDropDownIcon/></span>);
  else if (order === 'asc') return (<ArrowDropDownIcon />);
  else if (order === 'desc') return (<ArrowDropUpIcon />);
  return null;
}

const columnFormatter = (column, colIndex, { sortElement, filterElement }) => {
  return (
    <div style={ { minWidth: "52px",display: 'flex', flexDirection: 'column' } }>
      { filterElement }
      { column.text }
      {sortElement}
    </div>
  );
}
/*****************************/
/**
 * Table where alot of the magic happens.
 * Provides most of the functionality of the application
 */
/*****************************/

class TeamMembers extends Component {
  constructor(props){
    super(props);
    this.state = { 
      selected: [],
      colIndex: 0, 
      deleteButtonDisabled: true,
      teamMembers:[]};
  }
  /**
   * grab team members
   */
  componentDidMount(){
    axios
      .get(url)
      .then(res => this.setState({ teamMembers: [...res.data]}) )
      .catch(err => console.log(err));
  }

/**
 * handles when we click the delete button. allows multiple
 * rows to be deleted at once.
 */
  handleDeleteClick = () => {
    this.state.selected.forEach((id)=>{
      axios
        .delete(url+`${id}/`)
        .catch(err => console.log(err));

    })

      this.setState(() => ({
        teamMembers: this.state.teamMembers.filter(teamMember => 
          !this.state.selected.includes(teamMember.id)),
        selected: [],
        deleteButtonDisabled:true
      }));
  }
  /**
   * handles when we select a row
   * @param {*} row row we are selecting
   * @param {*} isSelect true or false based on if we are selecting or deselecting
   */
  handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      this.setState(() => ({
        selected: [...this.state.selected, row.id]
      }));
      if(this.state.deleteButtonDisabled){
        this.setState(() => ({
          deleteButtonDisabled: false
        }));

      }
    } else {
      this.setState(() => ({
        selected: this.state.selected.filter(x => x !== row.id)
      }));
      if(this.state.selected.length<2){
        this.setState(() => ({
          deleteButtonDisabled: true
        }));

      }
    }
  }
/**
 * Handles when we select all the row
 * @param {*} isSelect true or false based on if we are selecting or deselecting
 * @param {} rows rows of our table
 */
  handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id);
    if (isSelect) {
      this.setState(() => ({
        selected: ids
      }));
      if(this.state.deleteButtonDisabled){
        this.setState(() => ({
          deleteButtonDisabled: false
        }));
      }
    } else {
        this.setState(() => ({
          selected: []
        })); 
        if(!this.state.deleteButtonDisabled){
          this.setState(() => ({
            deleteButtonDisabled: true
          }));
        }
      }
  }
  /**
   * provides a way to upload our photo to the local db.
   * photo is sent as a file, which is then saved in the local db
   * 
   * @param {*} row persons info we are uploading the photo to
   * @param {*} e event that gives us the file chosen to upload
   */
  uploadPhoto = (row, e) => {
  const files = Array.from(e.target.files)
  const formData = new FormData()
  //append new history to user
  const newHistory = {
    image: 'https://i.pravatar.cc/100?img=69',
    date: moment().format("MM DD, YYYY hh:mm:ss a"),
    summary: `Admin changed ${row.name} photo to ${files[0].name} `,
  }
  let history = JSON.parse(row.history)
  history.unshift(newHistory)
  row["history"]=JSON.stringify(history)
  //append new photo to form
  formData.append('photo', files[0],files[0].name);
  for (const [key, value] of Object.entries(row)) {
    if(key!=="photo"){
      formData.append(key, value);
    }
  }
  //upload new user info
  axios
        .put(url+`${row.id}/`, formData)
        .then(res=>{
          axios
          .get(url)
          .then(res => this.setState({ teamMembers: [...res.data]}) )
          .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}
/**
 * render the table.
 */
  render(){
    /***********************************/
    //Table helper consts and functions//
    /***********************************/
    const option = {sizePerPageRenderer};
    
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: false,
      clickToEdit: true,
      style: { backgroundColor: 'lightgrey'},
      selected: this.state.selected,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll
    };
    
    const defaultSorted = [{
      dataField: 'name',
      order: 'asc'
    }];

    const columns = [
      {dataField: 'id', text: 'ID', sort: true, hidden: true}, 

      {dataField: 'name', text: 'Name', sort: true, filter: textFilter(), 
      headerFormatter: columnFormatter, sortCaret: sortCaret}, 

      {dataField: 'position', text: 'Position',sort: true,
       headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'department', text: 'Department', editor: { type:Type.SELECT, options:departments },
       sort: true, filter: textFilter(), headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'start', formatter:dateFormatter, editor:{ type:Type.Date}, text: 'Start Date',sort: true,
       headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'end', formatter:dateFormatter, editor:{ type:Type.Date}, text: 'End Date', sort: true,
       headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'status', editor: { type:Type.SELECT, options:employeeStatus }, text: 'Employment Status', sort: true, 
      headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'shift', editor: { type:Type.SELECT, options:shiftOptions }, text: 'Shift', sort: true,
       headerFormatter: columnFormatter, sortCaret: sortCaret},

      {dataField: 'manager', text: 'Manager', sort: true, filter: textFilter(),
       headerFormatter: columnFormatter, sortCaret: sortCaret},
    ];

    /**
     * updates the cell of the table with this callback function being used
     * 
     * @param {*} oldValue old value of cell
     * @param {*} newValue new value of cell
     * @param {*} row updated user info
     * @param {*} column column we are updating
     */
    function afterSaveCell(oldValue, newValue, row, column) {
      const newHistory = {
        image: 'https://i.pravatar.cc/100?img=69',
        date: moment().format("MM DD, YYYY hh:mm:ss a"),
        summary: `Admin changed ${row.name} ${column.dataField} to ${newValue} `,
      }
      let history = JSON.parse(row.history)
      history.unshift(newHistory)
      row["history"]=JSON.stringify(history)
      const formData = new FormData();
      for (const [key, value] of Object.entries(row)) {
        if(key!=="photo" && key!=="id"){
          formData.append(key, value);
        }
      }
    //need to download the photo, because our database expects
    //a file object, not a url. we have to generate a file object
    //from the url. 
      axios.get(row.photo, { responseType: 'blob' })
      .then((res)=>{
        const imageName =row.photo.split("/").slice(-1).pop();
        const newFile = new File([res.data], imageName,{type: "image"} )
        formData.append('photo', newFile, newFile.name);
        axios
        .put(url+`${row.id}/`, formData)
        .catch(err=>console.log(err))
      })
     }

     function saveField(newValue, inputProps) {
      const newHistory = {

        image: 'https://i.pravatar.cc/100?img=69',
        date: moment().format("MM DD, YYYY hh:mm:ss a"),
        summary: `Admin changed ${inputProps.row.name} ${inputProps.fieldName} to ${newValue} `,
      }
      //set the history
      inputProps.row[inputProps.fieldName]=newValue;
      let history = JSON.parse(inputProps.row.history)
      history.unshift(newHistory)
      inputProps.row["history"]=JSON.stringify(history)
      const formData = new FormData();
      for (const [key, value] of Object.entries(inputProps.row)) {
        if(key!=="photo" && key!=="id"){
          formData.append(key, value);
        }
      }
    //need to download the photo, because our database expects
    //a file object, not a url. we have to generate a file object
    //from the url. 
      axios.get(inputProps.row.photo, { responseType: 'blob' })
      .then((res)=>{
        const imageName =inputProps.row.photo.split("/").slice(-1).pop();
        const newFile = new File([res.data], imageName,{type: "image"} )
        formData.append('photo', newFile, newFile.name);
        axios
        .put(url+`${inputProps.row.id}/`, formData)
        .catch(err=>console.log(err))
      })
     
     }
     /**
      * Row expansion function. provides user card that acts as an
      * id for the user.
      */
     const expandRow = {
      onlyOneExpanding: true,
      renderer: row => (  
        <Row className= "text-center">
          <Col sm={12}>
            <Card className="text-center user-cards">
              <CardHeader title={row.name}></CardHeader>
              <CardContent className="text-left">
                <Row>
                  <Col sm={9}>
                  <Row className="fieldContainer">
                <EmailIcon className="fieldLabel" color="primary"/>
                  <EdiText
                    type="text"
                    inputProps={{fieldName:"emailaddress",row:row}}
                    buttonsAlign='before'
                    value={row.emailaddress}
                    onSave={(saveField)}
                  />
                </Row>
                <Row className="fieldContainer">
                <PhoneIcon className="fieldLabel" color="primary"/>
                  <EdiText
                    type="text"
                    inputProps={{fieldName:"phonenumber",row:row}}
                    buttonsAlign='before'
                    value={row.phonenumber}
                    onSave={(saveField)}
                  />
                </Row>
                <Row className="fieldContainer">
                <HomeIcon className="fieldLabel" color="primary"/>
                  <EdiText
                    type="text"
                    inputProps={{fieldName:"address",row:row}}
                    buttonsAlign='before'
                    value={row.address}
                    onSave={(saveField)}
                  />
                </Row>
                <Row className="fieldContainer">
                <ColorLensIcon className="fieldLabel" color="primary"/>
                  <EdiText
                    type="text"
                    inputProps={{fieldName:"color",row:row}}
                    buttonsAlign='before'
                    value={row.color}
                    onSave={(saveField)}
                  />
                </Row>
                  </Col>
                  <Col sm={3} className="sm-offset-3">
                    <Image className="contactImage" src={row.photo} rounded/>
                  </Col>
                </Row>
                <Row className="mx-auto">
                  <Col sm={12}>
                  
                  <Button
                      className="text-center contactButton"
                      variant="contained"
                      color="primary"
                      href={"/activitylog/"+row.id}
                      startIcon={<HistoryIcon />}
                    >
                      History
                  </Button>
                  
                  <Button
                       className="text-center contactButton"
                       color="secondary"
                       variant="contained"
                       component="label"
                       startIcon={<InsertPhotoIcon />}
                       onChange = {(e)=>{this.uploadPhoto(row, e)}}
                     >
                       Upload Photo
                       <input
                        hidden
                         accept="image/*"
                         style={{ display: 'none' }}
                         type="file"
                        />
                       </Button>
                    </Col>
                </Row>
              </CardContent>

            </Card>
          </Col>
          </Row>
      ),
      showExpandColumn: true,
      expandByColumnOnly: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        if (isAnyExpands) {
            return <b>-</b>;
        }
          return <b>+</b>;
      },
      expandColumnRenderer: ({ expanded }) => {
        if (expanded) {
          return (
            <Tooltip title="collapse" enterDelay={500} leaveDelay={200}>
              <b>-</b>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="expand" enterDelay={500} leaveDelay={200}>
            <b>+</b>
          </Tooltip>
      
        );
      }
    }
    /************************************/
    //END Table Helpers                 //
    /***********************************/
    //render table and buttons
    return (
      <div>
        <div className="view-header">
          <Card className="view-title">
            <CardHeader title={"Team Members"}></CardHeader>
          </Card>
        </div>
      <div className="team-member-table">
        <Button
        className="deleteButton"
        disabled={this.state.deleteButtonDisabled}
        variant="contained"
        onClick = {this.handleDeleteClick}
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
      
      <Button
         className="addButton"
         variant="contained"
         href={"/newuser"}
        startIcon={<AddIcon/>}
       >
         Add
     </Button>
                  
        <div>
        <BootstrapTable
          keyField="id"
          data={ this.state.teamMembers }
          columns={ columns }
          defaultSorted= {defaultSorted}
          selectRow={ selectRow }
          expandRow={ expandRow }
          pagination={ paginationFactory(option) }
          filter={ filterFactory() }
          headerClasses="header-class"
          cellEdit={ cellEditFactory({ mode: 'click',blurToSave: true, afterSaveCell }) }/>
        </div>
      
      </div>
      </div>

    );
  }
}
export default TeamMembers;



