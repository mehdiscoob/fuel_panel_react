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
import {httpGet} from "../../helper/httpMethods";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {deleteStatus} from "../../actions/DeleteItemAction";
import {changeLoading, deleteItem, getAllItems} from "../../actions/CrudActions";


const HardDeleteModal = ({
                 isHardDelete,
                 deleteUrl,
                 operations,
                 startDate,
                 endDate,
                 currentPage,
                 keyword,
                 url,
               }) => {
  const dispatch = useDispatch();
///state variables

  ///useEffect

// functions
  const deleteItems = (id) => {
    dispatch(changeLoading(true))
    dispatch(deleteItem(deleteUrl, id)).then(() => {
      let data = {page: currentPage, keyword: keyword, startDate: startDate, endDate: endDate}
      dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate)).then(() => {
        dispatch(changeLoading(false))
      })
    });
  }
  return (
    <CModal visible={isHardDelete} onClose={() => dispatch(deleteStatus(false))}>
      <CModalHeader onClose={() => dispatch(deleteStatus(false))}>
        <CModalTitle>Remove</CModalTitle>
      </CModalHeader>
      <CModalBody>Do you want remove this item?</CModalBody>
      <CModalFooter>
        <CButton onClick={() => {
          deleteItems(), dispatch(deleteStatus(false))
        }} color="danger">Clear</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default HardDeleteModal
