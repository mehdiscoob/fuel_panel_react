import React, {useState} from 'react'
import DataTable from "../tables/DataTable";
import {setOrder} from "../../actions/SortingAction";
import {useDispatch, useSelector} from "react-redux";

const ClientsTable = (props) => {

  localStorage.setItem('breadcrumbs', [JSON.stringify({
    pathname: '/comment/comments-table/',
    name: 'Comments Table',
    active: true
  })])

  let baseUrl = process.env.REACT_APP_BASE_URL;
  let dispatch=useDispatch();
  const url = 'api/client';
  const info = {
    'id': {column:'ID',type:'number'},
    'name': {column:'Name',type:'string'},
    'email': {column:'Email',type:'string'},
    'mobile': {column:'Mobile Number',type:'string',isSorting: 'false'},
    'created_at': {column:'Created',type:'date'},
  }
  const operations = {
    'isDelete': false,
    'isDetail': false,
    'isUpdate': false,
    'hasModal': [],
    'hasLink':[],
    'create':'',
    'checked':[],
  }
  dispatch(setOrder(null,null))

  return (

    <>
      <DataTable deleteUrl={url} url={url} info={info} operations={operations} searchUrl={url} title='Client'/>
    </>

  )
}

export default ClientsTable
