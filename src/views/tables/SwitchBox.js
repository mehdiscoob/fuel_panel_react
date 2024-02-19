import React, {useEffect, useState} from 'react'
import {
  CButton,
  CCol,
  CModal,
  CModalBody, CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner
} from "@coreui/react";
import {httpGet, httpPost} from "../../helper/httpMethods";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {switchBoxArray, switchBoxStatus} from "../../actions/SwitchBoxAction";
import {getAllItems} from "../../actions/CrudActions";


const SwitchBox = ({
                     isCheckBox,
                     switchUrl,
                     switchItem,
                     switchbox,

                   }) => {
  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.crud);
  const sorting = useSelector((state) => state.sorting);
///state variables
  ///useEffect

  ///function
  const changeSwitch = async () => {
    let change = httpPost(switchUrl, {id: switchItem.id, position: switchItem.position}).then((response) => {
      if (response == 'exception') {
        return toast.error('there is an Exception')
      }
      dispatch(switchBoxStatus(false))
      let currentSwitchers = [...switchbox];
      currentSwitchers[switchItem['index']] = switchItem['position'];
      dispatch(switchBoxArray([...currentSwitchers]))
      let data = {keyword: allItems.keyword, page: (+allItems.currentPage), startDate: allItems.startDate, endDate: allItems.endDate ,  orderBy: sorting.order,
        orderByColumn: sorting.orderColumn,filterVal:allItems.filterVal,filterColumn:allItems.filterColumn}
        dispatch(getAllItems(allItems.url, data, allItems.isDelete, allItems.isDetail, allItems.isUpdate))
      toast.success('The Item was changed');
    }).catch((error) => {
      console.log(error)
      toast.error('There is an Exception');
    });
    return await change;

  }
  return (
    <CModal visible={isCheckBox} onClose={() => dispatch(switchBoxStatus(false))}>
      <CModalHeader onClose={() => dispatch(switchBoxStatus(false))}>
        <CModalTitle></CModalTitle>
      </CModalHeader>
      <CModalBody>Do you Change this?</CModalBody>
      <CModalFooter>
        <CButton onClick={() => {
          dispatch(switchBoxStatus(true));
          changeSwitch()
        }} color="success">Yes</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SwitchBox
