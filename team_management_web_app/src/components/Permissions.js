import React, { Component } from 'react';
import { Card, CardHeader } from '@material-ui/core';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type }  from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import axios from 'axios';

const permissionDropDown= [{
  value: 'Admin',
  label: 'Admin'
}, {
  value: 'Basic',
  label: 'Basic'
},
{
  value: 'Manager',
  label: 'Manager'
}];
const url = 'http://localhost:8000/api/users/'

/**
 * helper function provided to table pagation props.
 */
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
 * Provides a table filled with user and their permissions.
 * You can update the user permissions in the table.
 */
class Permissions extends Component{
  constructor(props){
    super(props);
    this.state = {
      teamMembers : []
    }
  }
  /**
   * get our team member data once the component loads
   */
  componentDidMount(){
    axios
      .get(url)
      .then(res => this.setState({ teamMembers: [...res.data]}) )
      .catch(err => console.log(err));
  }
  /**
   * helper needed to provide labels for sorting carets
   * @param {*} order sorting order we want
   * @param {*} column column that we are sorting
   */
  sortCaret = (order, column) => {
    if (!order) return (<span><ArrowDropUpIcon/><ArrowDropDownIcon/></span>);
    else if (order === 'asc') return (<ArrowDropDownIcon />);
    else if (order === 'desc') return (<ArrowDropUpIcon />);
    return null;
  }
  /**
   * provides formatting for our columns
   * @param {*} column column we are formatting
   * @param {*} colIndex column index
   */
  columnFormatter = (column, colIndex, { sortElement, filterElement }) => {
    return (
      <div style={ { minWidth: "52px",display: 'flex', flexDirection: 'column' } }>
        { filterElement }
        { column.text }
        {sortElement}
      </div>
    );
  }
  /**
   * render our components
   */
  render(){
    //create all our data for the table
    //******************************* *//
    const columns = [
      {dataField: 'id', text: 'ID', sort: true, hidden: true}, 
      {dataField: 'name', text: 'Name', sort: true, filter: textFilter(), 
      headerFormatter: this.columnFormatter, sortCaret: this.sortCaret }, 

      {dataField: 'permissions', editor: { type:Type.SELECT, options:permissionDropDown }, text: 'Permissions', 
      filter: textFilter(), sort: true, headerFormatter: this.columnFormatter, 
      sortCaret: this.sortCaret},
    ];
    const defaultSorted = [{
      dataField: 'name',
      order: 'asc'
    }];
    const option = {sizePerPageRenderer};
    function afterSaveCell(oldValue, newValue, row, column) { 
      axios
        .put(url+`${row.id}/`, row)
     }
    //******************************* *//

  return (
    <div>
      <div className="view-title">
        <Card className="view-title">
            <CardHeader title={"Permissions"}></CardHeader>
        </Card>
      </div>
    <div className="permissions-table">
      <BootstrapTable
          keyField="id"
          data={ this.state.teamMembers }
          columns={ columns }
          defaultSorted= {defaultSorted}
          pagination={ paginationFactory(option) }
          filter={ filterFactory() }
          headerClasses="header-class"
          cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell }) }/>
        </div>
    </div>
  );
  }
}
export default Permissions;
