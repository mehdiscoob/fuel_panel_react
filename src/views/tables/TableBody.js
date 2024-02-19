import React, {useEffect, useState} from 'react'
import {
  CButton,
  CCol, CFormCheck,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner, CTableBody, CTableDataCell, CTableRow
} from "@coreui/react";
import {httpGet} from "../../helper/httpMethods";
import {changeLoading, getAllItems, getItemById} from "../../actions/CrudActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clickPagination, loadingPage, nextPage, otherPage, previousPage} from "../../actions/PaginationAction";
import {NavLink, useSearchParams} from "react-router-dom";
import {modalStatus, setIdForModal, setModalId} from "../../actions/ModalAction";
import TableDetail from "./TableDetail";
import Switch from "react-switch";
import {deleteStatus, deleteDetail} from "../../actions/DeleteItemAction";
import {getSwitchBoxItem, switchBoxStatus} from "../../actions/SwitchBoxAction";
import axios from "axios";
import {setLocalStorage} from "../../helper/localStorage";
import {authentication} from "../../actions/AuthAction";
import {fetchSelectData, statusSelectAll} from "../../actions/SelectActions";


const TableBody = ({
                     datas,
                     operations,
                     isDelete,
                     switchbox,
                     switchUrl,
                     columns,
                     dyCol,
                     dynamicCol,
                     info,
                     updateUrl,
                     logingAs,
                     counter,
                     detailUrl,
                   }) => {
  const dispatch = useDispatch();
  const modals = useSelector((state) => state.modal);
  const allItems = useSelector((state) => state.crud);
  let selectAllStatus = useSelector((state) => state.select.selectAll);
  let selecting = useSelector((state) => state.select);
  let [idSelects, setIdSelects] = React.useState([]);
  const deleteItems = useSelector((state) => state.deleteItem);
///state variables
  let [counters, setCounters] = React.useState(1);

  let [selectAll, setSelectAll] = React.useState([]);
  let changeStatus = (position, index) => {
    let miniModal = [];
    operations.hasModal.forEach((item, index) => {
      miniModal.push(false);
    })
    miniModal[index] = position;
    dispatch(modalStatus(miniModal));
  }
  ///useEffect
  useEffect(() => {
    setCounters(counter)
  }, [counter])


  // function
  const setDeleteModalContent = (id) => {
    let text = 'Do you want remove this item?';
    dispatch(deleteDetail(id))
  }
  const LoginAs = async (id, other) => {
    let token = JSON.parse(localStorage.getItem('admin_user'));
    if (other != null) {
      id = other
    }
    httpGet(logingAs.url + '/' + id).then((response) => {
      axios.get(process.env.REACT_APP_API_URL + 'api/auth/user', {headers: {'Authorization': `Bearer ${response.data.access_token}`}}).then((response) => {
        setLocalStorage('User', response.data)
      }).catch((error) => {
        if (error.status == 401) {
          toast.error('User has Not credential');
          // localStorage.removeItem('admin_user')
          // dispatch(authentication())
        }
      })
      let store = {
        refresh_token: response.data.refresh_token,
        token_type: response.data.token_type,
        is_token_valid: true,
        access_token: response.data.access_token
      }
      setLocalStorage('auth-token', store)
      window.open(logingAs.redirect, '_blank')
    }).catch((error) => {
      if (error.status == 401) {
        toast.error('User has Not credential');
        // toast.error('User has Not credential');
        // localStorage.removeItem('admin_user')
        // dispatch(authentication())
      }
      if (error.status == 400) {
        toast.error('User in Not Active')
      }
    })
  }
  let changeSelectItem = (status, index) => {
    let allSelect = selectAll;
    let idSelect = idSelects;
    allSelect[index] = !status;
    let selectTrueExist = allSelect.filter(q => q == true);
    if (status) {
      idSelect = idSelect.filter(q => q != allItems.items[index].id)
      setIdSelects([...idSelect])
      dispatch(fetchSelectData(idSelect, false));
    } else {
      idSelect.push(allItems.items[index].id);
      setIdSelects([...idSelect])
      dispatch(fetchSelectData(idSelect, status));
    }
    if (selectTrueExist.length == allItems.items.length) {
      dispatch(statusSelectAll(true))
    }
    setSelectAll([...allSelect])
  }
  if (operations.select && operations.select.length != 0) {
    useEffect(() => {

      let selectPush = [];
      let idSelect = [];
      idSelect = [...selecting.dataSelect]
      let selectFalseExist = selectAll.filter(q => q == false);
      let selectTrueExist = selectAll.filter(q => q == true);
      if (selectFalseExist.length == allItems.items.length || allItems.items.length == selectTrueExist.length || selectAll.length == 0 || selectAllStatus) {
        if (selectAllStatus) {
          for (let i = 0; i < allItems.items.length; i++) {
            selectPush.push(true);
            if (!idSelect.includes((allItems.items[i]['id']))) {
              idSelect.push(allItems.items[i]['id'])
            }
          }
        } else {
          for (let i = 0; i < allItems.items.length; i++) {
            selectPush.push(false);
          }
        }
        setSelectAll([...selectPush])
        setIdSelects([...idSelect])
        if (selectAllStatus) {
          dispatch(fetchSelectData(idSelect, selectAllStatus))
        }
      }
    }, [selectAllStatus])
    useEffect(() => {
      let allSelect = [];
      let idSelect = [];
      let statusSelectsAll = true;
      datas.map((item, index) => {
        if (selecting.dataSelect.includes(item.id)) {
          allSelect.push(true);
        } else {
          statusSelectsAll = false;
          allSelect.push(false);
        }
      });
      if (statusSelectsAll) {
        dispatch(statusSelectAll(true))
      }
      setSelectAll([...allSelect])
    }, [])
  }

  return (
    <>
      <CTableBody>
        {
          datas.map((item, index) =>
            <CTableRow key={!isNaN(item.id) ? item.id : index} data-id={item.id}>
              {operations.select != null &&
                <CTableDataCell scope="row"><CFormCheck checked={selectAll[index]} onChange={(e) => {
                  changeSelectItem(selectAll[index], index)
                }}/></CTableDataCell>}
              {operations.counter != null &&
                <CTableDataCell scope="row">{parseInt(counters) + index}</CTableDataCell>}
              <TableDetail dyCol={dyCol} dynamicCol={dynamicCol} columns={columns} info={info}
                           item={item} index={index}/>
              {operations.isDelete || operations.isDetail || operations.isUpdate || operations.hasModal.length != 0 || operations.hasLink.length || operations.checked.length != 0 || logingAs != undefined ?
                <CTableDataCell
                  style={operations.isDelete && operations.isDetail && operations.isUpdate && operations.hasModal.length != 0 && operations.hasLink.length != 0 ? {width: '10%'} : {width: '20%'}}>
                  {operations.checked.length != 0 ?
                    operations.checked.map((checked, checkedIndex) => <span key={checkedIndex}
                                                                            className='position-relative'
                                                                            style={{top: '10px'}}><Switch
                        checked={switchbox.length != 0 ? switchbox[index] : false} disabled={checked.disables?checked.disables.filter((it)=>item[it.column]==it.value).length!=0?true:false:false} onChange={(e) => {
                        dispatch(switchBoxStatus(true));
                        dispatch(getSwitchBoxItem(switchUrl, {index: index, id: item.id, position: e}))
                      }}></Switch></span>
                    ) : ''}
                  {operations.isDetail ?
                    <NavLink to={detailUrl + item.id}><CButton className='m-1' style={{
                      width: '40px',
                      height: '40px'
                    }} title={'Detail'} color="warning"> <i
                      className="text-center fa fa-eye" style={{fontSize: '12px'}}
                      aria-hidden="true"></i></CButton></NavLink> : ''}
                  {operations.isUpdate ?
                    <NavLink to={updateUrl + item.id}><CButton className='m-1' style={{
                      width: '40px',
                      height: '40px'
                    }} title={'Edit'} color="secondary"> <i
                      className="text-center fa fa-edit" style={{fontSize: '12px'}}
                      aria-hidden="true"></i></CButton></NavLink> : ''}
                  {operations.isDelete ? <CButton title={'Remove'} onClick={() => {
                    dispatch(deleteStatus(!deleteItems.isDelete));
                    setDeleteModalContent(item.id)
                  }} color="danger" className='m-1' style={{width: '40px', height: '40px'}}> <i
                    className="text-center fa fa-trash mx-1" style={{fontSize: '12px'}}
                    aria-hidden="true"></i></CButton> : ''}
                  {operations.hasLink.length != 0 ?
                    operations.hasLink.map((link, linkIndex) => link.dataType == 'exist' || (link.dataType != 'exist' && item[link.dataType] != null) ?
                      <a key={linkIndex}
                         href={link.dataType == 'exist' ? link.url + (link.column != null ? '/' + item[link.column] : '') : item[link.dataType] + (link.column != null ? '/' + item[link.column] : '')}
                         target={link['open'] == '1' && '_blank'}><CButton
                        className='m-1' style={{width: link.icon && '40px', height: link.icon && '40px'}}
                        title={link.title}
                        key={linkIndex - index - (!isNaN(item.id) && item.id)} color={link.color}>
                        {link.icon ? <i className={'text-center ' + link.icon} style={{fontSize: '12px'}}
                                        aria-hidden="true"></i> : link.text}</CButton></a> : "") : ''}

                  {operations.hasModal.length != 0 ?
                    operations.hasModal.map((modal, modalIndex) =>
                      modal.dependency == null ||
                      (modal.dependency != null && modal.dependency.type == "boolean" && item[modal.dependency.content]) ||
                      (modal.dependency != null && modal.dependency.type == "nullable" && item[modal.dependency.content] != null)
                        ?
                        <CButton className='m-1' style={{
                          width: modal.icon ? '40px' : '82px',
                          height: modal.icon && '40px',
                          color: modal.color == 'white' ? 'black' : 'white',
                          fontSize: modal.text && '10px',
                        }} title={modal.title} key={modalIndex - index - item.id} onClick={() => {
                          dispatch(setIdForModal(item.id));
                          changeStatus(true, modalIndex);
                        }} color={modal.color}>
                          {modal.icon ? <i className={'text-center ' + modal.icon} style={{fontSize: '12px'}}
                                           aria-hidden="true"></i> : modal.text}</CButton> : "") : ''}

                  {logingAs != undefined ? <CButton title={'Login As User'} onClick={() => {
                    LoginAs(item.id, item[logingAs.param])
                  }} color={logingAs.color} className='m-1' style={{width: '40px', height: '40px'}}>
                    <i className={logingAs.icon} style={{fontSize: '12px'}}
                       aria-hidden="true"></i></CButton> : ''}
                  {item.is_banned == 1 &&
                    <span title={'Banned'} className='pt-lg-3 h-100' style={{cursor: 'pointer'}}>
                    <i className='fa fa-ban fa-3x text-danger' style={{fontSize: '24px'}}
                       aria-hidden="true"></i></span>}
                </CTableDataCell> : ''}
            </CTableRow>
          )
        }
      </CTableBody>
    </>
  )
}

export default TableBody
