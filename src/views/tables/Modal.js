import React, {useEffect, useState} from 'react'
import {
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner
} from "@coreui/react";
import {httpGet} from "../../helper/httpMethods";
import {changeLoading, getAllItems, getItemById} from "../../actions/CrudActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clickPagination, loadingPage, nextPage, otherPage, previousPage} from "../../actions/PaginationAction";
import {useSearchParams} from "react-router-dom";
import {modalStatus} from "../../actions/ModalAction";
import {indexOf} from "core-js/internals/array-includes";


const Modal = ({
                 hasModal,
                 id,
                 modalUrl,
                 operations,
                 content
               }) => {
  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.crud.item);
  const modals = useSelector((state) => state.modal);
///state variables
  const [activeModal, setActiveModal] = useState([])
  const [isMOdalActive, setIsMOdalActive] = useState(true)
  ///useEffect
  useEffect(() => {
    setActiveModal(hasModal)
    // dispatch(modalStatus(hasModal))
  }, [hasModal])
  useEffect(() => {
    if (modals.id!=0) {
    for (let i =0;i<activeModal.length;++i){
      if (activeModal[i]) {
        setIsMOdalActive(true)
        dispatch(getItemById(modalUrl, id))
        break
      }
    }

    }
  }, [activeModal])
  useEffect(()=>{
    if (allItems!=null && allItems.id){
    if (allItems.id==modals.id){
      setIsMOdalActive(false)
    }
    }

  },[allItems])
  let changeStatus = (position, index) => {
    let miniModal = [];
    hasModal.map((item,index)=>{
      miniModal.push(false);
    })
    miniModal[index] = position;
    dispatch(modalStatus(miniModal));
    setActiveModal(miniModal)
  }

  return (
    content.map((item, index) =>
      <CModal key={index} size={operations.hasModal[index].size?operations.hasModal[index].size:'xl'} visible={activeModal[index]} onClose={() => {
        changeStatus(false, index)
      }}>
        <CModalHeader onClose={() => {
          changeStatus(false, index)
        }}>
          <CModalTitle></CModalTitle>
        </CModalHeader>
        <CModalBody>
          {!isMOdalActive ? item : <div>
            <div>
              <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/>
              <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/>
              <CSpinner color="dark" variant="grow"/>
            </div>
          </div>}
        </CModalBody>

      </CModal>
    )

  )
}

export default Modal
