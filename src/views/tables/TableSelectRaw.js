import React, {useEffect} from 'react';
import {CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow} from "@coreui/react";
import {httpPost, httpPut} from "../../helper/httpMethods";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {changeLoading, getAllItems} from "../../actions/CrudActions";
import {fetchSelectData} from "../../actions/SelectActions";

function TableSelectRaw({list}) {
  let selectAllStatus = useSelector((state) => state.select);
  let allItems = useSelector((state) => state.crud);
  let dispatch = useDispatch();
  let [isHardDelete, setIsHardDelete] = React.useState(false);
  let [url, setUrl] = React.useState("");
  let [title, setTitle] = React.useState("");
  let apiCalling = (url) => {
    let data = selectAllStatus.dataSelect;
    if (data.length == 0) {
      return toast.error("There is no selected!");
    }
    dispatch(changeLoading(true))
  return httpPost(url, {dataSelect: selectAllStatus.dataSelect}).then((response) => {
    toast.success('The Podcatchers are Transformed');
    dispatch(fetchSelectData([],false));
    dispatch(getAllItems(allItems.url, {}))
    }).catch((error)=>{
    toast.error('There is an Exception');
  })
  }

  return (
    <>
      <CCol sm={12} className="bg-white mt-1 position-relative"
            style={{height: '2.5rem', borderRadius: "7px", boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
        <CRow>
          <CCol sm={4}>
            <CRow>
              {list.map((item, index) =>
                <CCol key={index} sm={2} className="mt-1">
                  <i style={{cursor: "pointer", borderRadius: "50%"}}
                     onMouseOver={(e) => {
                       e.target.style['background'] = "#ececec"
                     }}
                     onMouseOut={(e) => {
                       e.target.style['background'] = "#ffffff"
                     }}
                     onClick={(e) => {
                       setIsHardDelete(true);
                       setUrl(item.url);
                       setTitle(item.title)
                     }}
                     className={`fa ${item.icon} p-2`} title={item.title}></i>
                </CCol>
              )
              }
              {/*confirm modal*/}
              <CModal visible={isHardDelete} onClose={() => setIsHardDelete(false)}>
                <CModalHeader onClose={() => setIsHardDelete(false)}>
                  <CModalTitle>{title}</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you about it?</CModalBody>
                <CModalFooter>
                  <CButton onClick={() => {
                    apiCalling(url), setIsHardDelete(false)
                  }} color="success">Yes</CButton>
                </CModalFooter>
              </CModal>
            </CRow>
          </CCol>
        </CRow>
        <div className="position-absolute" style={{right: "10px", top: "10px",width:'23px',borderRadius:"50%",textAlign:"center",background:"#e7e7e7"}}>
          {selectAllStatus.dataSelect.length}
        </div>
      </CCol>
    </>
  );
}

export default TableSelectRaw;
