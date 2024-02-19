import React, {useState} from 'react'
import DataTable from "../tables/DataTable";
import {setOrder} from "../../actions/SortingAction";
import {useDispatch, useSelector} from "react-redux";

const OrdersTable = (props) => {

  let dispatch=useDispatch();
  const url = 'api/order/';
  // const detailUrl = 'campaign/';
  // const updateUrl = '/campaign/update/';
  const info = {
    'id': {column:'ID',type:'number'},
    'clientName': {column:'Client Name',type:'string'},
    'userName': {column:'User Name',type:'string'},
    'amount': {column:'Amount',type:'string'},
    'created': {column:'Created',type:'string'},
  }
  const operations = {
    'isDelete': false,
    'isDetail': false,
    'isUpdate': false,
    'hasModal': [],
    'hasLink':[],
    'create':'/order/create/',
    'checked':[],
  }
  dispatch(setOrder(null,null))

  return (
    <>
      <DataTable deleteUrl={url} detailUrl={""} url={url} updateUrl={url} info={info} operations={operations} searchUrl={url} title='Order'/>
    </>
  )
}

export default OrdersTable
