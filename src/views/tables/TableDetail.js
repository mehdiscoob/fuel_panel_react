import React, {useEffect, useState} from 'react'
import {
CTableDataCell
} from "@coreui/react";
import moment from "jalali-moment";


const TableDetail = ({
                 dynamicCol,
                 dyCol,
                 columns,
                 info,
                 item,
                 index,
               }) => {
  return (
    <>
      {item['statuses'] != null && info['statuses']['type'] == 'optional'&& console.log(info['statuses']['options'].filter(q=>q.name==item['statuses'])[0],item['statuses'])}
      {dynamicCol == null ? columns.map((item2, indexes) =>
        <CTableDataCell
          key={indexes + index + (!isNaN(item.id) && item.id)}>{item[item2] != null && info[item2]['type'] == 'number' ? item[item2] : item[item2] != null &&
        info[item2]['type'] == 'jalali-date' ? moment(new Date(item[item2])).locale('fa').format('YYYY/MM/DD') :item[item2] != null &&
        info[item2]['type'] == 'jalali-time' ? moment(new Date(item[item2])).locale('fa').format('YYYY/MM/DD  HH:mm:ss') : item[item2] != null &&
        info[item2]['type'] == 'string' ? item[item2].length < 80 && item[item2].length > 0 ?
          item[item2] : item[item2].substring(0, 50) + ' ...' : item[item2] != null && info[item2]['type'] == 'switch' ?
          item[item2] != 0 || (item[info[item2]['other']] != null && item[info[item2]['other']] != 0) ?
          <i className='fa-2x fa fa-check text-success'></i> : <i
            className='fa-2x fa fa-multiply text-danger'></i> : item[item2] != null && info[item2]['type'] == 'switch-option' ? !info[item2]['wrong'].includes(item[item2]) && info[item2]['right'].includes(item[item2]) ?
          <i className='fa-2x fa fa-check text-success'></i> :info[item2]['wrong'].includes(item[item2]) && !info[item2]['right'].includes(item[item2]) ? <i
            className='fa-2x fa fa-multiply text-danger'></i>:<i>-</i> : item[item2] != null && info[item2]['type'] == 'optional' ?<div style={{position:"relative",width:"100%",textAlign:"center",padding:"3px 6px",marginTop:"10px"}}><div style={
              {background:info[item2]['options'].filter(q=>q.name==item[item2])[0]['background'],position:"absolute",top:0,left:0,opacity:0.15,width:"100%",height:"100%",borderRadius:"10px"}
            }></div> <span style={{color:info[item2]['options'].filter(q=>q.name==item[item2])[0]['background'],position:"relative",top:"50%",fontWeight:"700"}}><i className={info[item2]['options'].filter(q=>q.name==item[item2])[0]['icon']}/> {info[item2]['options'].filter(q=>q.name==item[item2])[0]['name']} </span> </div>: item[item2] != null && info[item2]['type'] == 'avatar' ?
          <img style={{width: '50px', borderRadius: '50%',height:"50px"}}
               src={item[item2]}/> : item[item2] != null && info[item2]['type'] == 'avatar-square' ?
            <img style={{width: '50px', height: '50px',borderRadius:"3px"}}
                 src={item[item2]}/> : item[item2] != null && info[item2]['type'] == 'banner' ?
              <img style={{width: '150px', height: '50px'}}
                   src={item[item2]}/> : '-'}</CTableDataCell>)
      : dyCol.map((item2, indexes) =>
        <CTableDataCell
          key={indexes + index + (!isNaN(item.id) && item.id)}>{item[item2] != null && info[item2]['type'] == 'number' ? item[item2] : item[item2] != null && info[item2]['type'] == 'jalali-date' ? moment(new Date(item[item2])).locale('fa').format('YYYY/MM/DD'):item[item2] != null && info[item2]['type'] == 'jalali-time' ? moment(new Date(item[item2])).locale('fa').format('YYYY/MM/DD  HH:mm:ss') : item[item2] != null && info[item2]['type'] == 'string' ? item[item2].length < 80 && item[item2].length > 0 ? item[item2] : item[item2].substring(0, 50) + ' ...' : item[item2] != null && info[item2]['type'] == 'switch' ? item[item2] != 0 || (item[info[item2]['other']] != null && item[info[item2]['other']] != 0) ?
          <i className='fa-2x fa fa-check text-success'></i> : <i
            className='fa-2x fa fa-multiply text-danger'></i> : item[item2] != null && info[item2]['type'] == 'switch-option' ? !info[item2]['wrong'].includes(item[item2]) && info[item2]['right'].includes(item[item2]) ?
          <i className='fa-2x fa fa-check text-success'></i> : <i
            className='fa-2x fa fa-multiply text-danger'></i> : item[item2] != null && info[item2]['type'] == 'avatar' ?
          <img style={{width: '50px', borderRadius: '50%',height:"50px"}}
               src={item[item2]}/> : item[item2] != null && info[item2]['type'] == 'avatar-square' ?
            <img style={{width: '50px', height: '50px',borderRadius:"3px"}}
                 src={item[item2]}/> : item[item2] != null && info[item2]['type'] == 'banner' ?
              <img style={{width: '150px', height: '50px'}}
                   src={item[item2]}/> : '-'}</CTableDataCell>)}
    </>
  )
}

export default TableDetail
