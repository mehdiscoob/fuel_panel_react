import React, {useEffect, useState} from 'react'
import {
  CButton, CCol, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPagination, CPaginationItem,
  CRow, CSpinner, CTable, CForm
} from "@coreui/react";
import {NavLink, useLocation, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem, getAllItems, getItemById} from "../../actions/CrudActions";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router";
import 'src/scss/datePicker.scss';
import moment from "jalali-moment";
import Pagination from "./Pagination";
import Modal from "./Modal";
import TableHead from "./TableHead";
import ExportModal from "./ExportModal";
import TableBody from "./TableBody";
import SwitchBox from "./SwitchBox";
import DeleteModal from "./DeleteModal";
import {httpPost} from "../../helper/httpMethods";
import TableSearch from "./TableSearch";
import TableDateSearch from "./TableDateSearch";
import TableSelectRaw from "./TableSelectRaw";
import AdvanceSearchTable from "./AdvanceSearchTable";


const DataTable = ({
                     searchUrl, url, info, operations, deleteUrl,
                     title, updateUrl, modalUrl, detailUrl, children,
                     switchUrl, maximun, logingAs, dynamicCol, excel,
                     startEnd, startEndUrl, csvStatus, hardDelete, exportUrl, blacklistExport, advanceSearch
                   }) => {
  // state varibles
  let [datas, setDatas] = React.useState([]);
  let [switchbox, setSwitchbox] = React.useState([]);
  let navigate = useNavigate();
  let [switchItem, setSwitchItem] = React.useState({});
  let [currentPage, setCurrentPage] = React.useState(1);
  let [lastPage, setLastPage] = React.useState(1);
  let [isLoading, setIsLoading] = React.useState(true);
  let [isStart, setIsStart] = React.useState(true);
  let [keyword, setKeyword] = React.useState('');
  let [startDate, setStartDate] = React.useState("");
  let [endDate, setEndDate] = React.useState("");
  let [inputStartDate, setInputStartDate] = React.useState("");
  let [inputEndDate, setInputEndDate] = React.useState("");
  let [counter, setCounter] = React.useState(1);
  let [selected, setSelected] = React.useState([]);
  let location = useLocation();
  const [isDelete, setIsDelete] = useState(false)
  const [isHardDelete, setIsHardDelete] = useState(false)
  const [removeId, setRemoveId] = useState(null)
  const [isCheckBox, setIsCheckBox] = useState(false)
  const [columns, setColumns] = useState([])
  const [hasModal, setHasModal] = useState([])
  const [hasExcel, setHasExcel] = useState(false)
  const [filterVal, setFilterVal] = useState("")
  const [filterColumn, setFilterColumn] = useState("")
  const [dyCol, setDyCol] = useState([])
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.crud);
  const paginations = useSelector((state) => state.pagination);
  const modals = useSelector((state) => state.modal);
  const deleteItemRedux = useSelector((state) => state.deleteItem);
  const exportModals = useSelector((state) => state.exportModal);
  const switchBoxes = useSelector((state) => state.switchBox);
  const sorting = useSelector((state) => state.sorting);
  const selecting = useSelector((state) => state.select);
  ///statics vaiables
  let countOfPages = [];
  let baseUrl = process.env.REACT_APP_BASE_URL;
  let apiUrl = process.env.REACT_APP_API_URL;
  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
      '-' + (mm > 9 ? '' : '0') + mm,
      '-' + (dd > 9 ? '' : '0') + dd
    ].join('');
  };
  //functions
  const changeColumns = async (item, position) => {
    setIsLoading(true)
    if (!position) {
      setDyCol([...dyCol, item])
      setIsLoading(false)
    } else {
      if (dyCol.length > 2) {
        let filterDy = dyCol.filter((q) => q != item);
        setDyCol(filterDy)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast.warning('There should be at least 2 columns')
      }
    }
  }
  const counterPage = (page) => {
    if (page != 0) {
      let first = ((page - 1) * 20) + 1;
      setCounter(first)
    }
  }
  const clickHardDelete = () => {
    setIsLoading(true)
    httpPost(hardDelete).then((response) => {
      dispatch(getAllItems(url, {page: 1}, operations.isDelete, operations.isDetail, operations.isUpdate))
      setIsLoading(false)
    })
  }
// make table Headers
  useEffect(() => {
    setIsLoading(true)
    searchParams.get('keyword') != null && setKeyword(searchParams.get('keyword'))
    searchParams.get('page') != null && searchParams.get('page') != undefined && setCurrentPage(searchParams.get('page'));
    // searchParams.get('orderBy') != null && searchParams.get('orderBy') != undefined && setOrderBy(searchParams.get('orderBy'));
    // searchParams.get('orderColumn') != null && searchParams.get('orderColumn') != undefined && setOrderColumn(searchParams.get('orderColumn'));
    // searchParams.get('filterVal') != null && searchParams.get('filterColumn') != undefined && setFilterVal(searchParams.get('filterVal'));
    // searchParams.get('filterColumn') != null && searchParams.get('filterVal') != undefined && setFilterColumn(searchParams.get('filterColumn'));
    searchParams.get('page') != null && searchParams.get('page') != undefined && setCurrentPage(searchParams.get('page'));
    searchParams.get('startDate') != null && setStartDate(moment.from(searchParams.get('startDate'), 'fa', 'YYYY/M/DD').locale('en').format('YYYY-MM-DD'))
    searchParams.get('endDate') != null && setEndDate(moment.from(searchParams.get('endDate'), 'fa', 'YYYY/M/DD').locale('en').format('YYYY-MM-DD'))
    let keyValue;
    for (keyValue in info) {
      columns.push(keyValue);
    }
  }, [])
  useEffect(() => {
    if (paginations.currentPage) {
      setCurrentPage(paginations.currentPage)
      if (operations.counter != null) {
        counterPage(paginations.currentPage)
      }
    } else {
      setCurrentPage(1)
      if (operations.counter != null) {
        counterPage(1)
      }
    }
  }, [paginations])
  useEffect(() => {
    setHasModal(modals.hasModal);
  }, [modals])

  useEffect(() => {
    setIsDelete(deleteItemRedux.isDelete)
    setRemoveId(deleteItemRedux.id)
  }, [deleteItemRedux])
  useEffect(() => {
    setHasExcel(exportModals.hasModal)
  }, [exportModals])
  useEffect(() => {
    setIsCheckBox(switchBoxes.isActive)
    setSwitchItem(switchBoxes.items)
    if (switchBoxes.switchboxList.length != 0) {
      setSwitchbox(switchBoxes.switchboxList)
    }
  }, [switchBoxes])
  useEffect(() => {
    if (columns.length != 0 && dynamicCol != null) {
      let dy = [];
      for (let i = 0; i < dynamicCol; i++) {
        dy.push(columns[i]);
      }
      setDyCol(dy)
    }
  }, [columns])
  useEffect(() => {
    setSelected([...selecting.dataSelect])
  }, [selecting])
  React.useEffect(() => {
    let start = searchParams.get('startDate') != null ? moment.from(searchParams.get('startDate'), 'fa', 'YYYY/M/DD').locale('en').format('YYYY-MM-DD') : "";
    let end = searchParams.get('startDate') != null ? moment.from(searchParams.get('endDate'), 'fa', 'YYYY/M/DD').locale('en').format('YYYY-MM-DD') : "";
    let orderColumn = null
    if (sorting.order != null && sorting.orderColumn != null) {
      info[sorting.orderColumn] != undefined ?? searchParams.set('orderColumn', info[sorting.orderColumn]['column'])
      searchParams.set('orderBy', sorting.order)
    }
    if (searchParams.get('orderColumn') != null && searchParams.get('orderColumn').length != 0) {
      orderColumn = 'ID';
      for (let i = 0; i < columns.length; i++) {
        if (info[columns[i]]['column'].toLowerCase() == searchParams.get('orderColumn').toLowerCase()) {
          orderColumn = columns[i];
        }
      }
    }
    if (!searchParams.get("page")) {
      navigate('?page=1')
    } else {
      if (searchParams.get("keyword")) {
        dispatch(getAllItems(searchUrl, {
            page: searchParams.get("page"),
            keyword: searchParams.get("keyword"),
            startDate: start,
            endDate: end,
            orderBy: searchParams.get('orderBy'),
            orderByColumn: orderColumn,
            filterVal: searchParams.get('filterVal'),
            filterColumn: searchParams.get('filterColumn'),
          }
        )).then(() => {
          searchParams.get("keyword") == null && setCurrentPage(1)
        })
      } else {
        let data = {
          page: searchParams.get("page"),
          keyword: keyword,
          startDate: start,
          endDate: end,
          orderBy: searchParams.get('orderBy'),
          orderByColumn: orderColumn,
          filterVal: searchParams.get('filterVal'),
          filterColumn: searchParams.get('filterColumn'),
        }
        dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
      }
    }
    if (!searchParams.get("page")) {
      let data = {
        page: currentPage,
        keyword: keyword,
        startDate: startDate,
        endDate: endDate,
        orderBy: searchParams.get('orderBy'),
        orderByColumn: orderColumn,
        filterVal: searchParams.get('filterVal'),
        filterColumn: searchParams.get('filterColumn'),
      }
      dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
    }
  }, [dispatch])
  React.useEffect(() => {
    setDatas(allItems.items)
    setKeyword(allItems.keyword)
    setStartDate(allItems.startDate)
    setEndDate(allItems.endDate)
    if (isStart) {
      setIsLoading(true)
      setIsStart(false)
    } else {
      setIsLoading(allItems.isLoading)
    }
    setCurrentPage(allItems.currentPage)
    if (lastPage != allItems.lastPage) {
      setLastPage(allItems.lastPage)
    }
  }, [allItems])
  React.useEffect(() => {
    if (sorting.order != null && sorting.orderColumn != null) {
      info[sorting.orderColumn] != undefined ?? searchParams.set('orderColumn', info[sorting.orderColumn]['column'])
      searchParams.set('orderBy', sorting.order)
    }
    let switchs = [];
    if (datas.length != 0) {
      datas.forEach((item, index) => {
        if (item.is_active == 1) {
          switchs.push(true)
        } else if (item.is_active == 0) {
          switchs.push(false)
        } else {
          switchs.push(item.is_active)
        }
      })
      setSwitchbox(switchs)
    }
  }, [datas])
  return (
    <div>
      {
        <CRow>
          <ToastContainer/>
          {isLoading ?
            <div>
              <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/>
              <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/><CSpinner color="dark"
                                                                                                           variant="grow"/>
            </div>
            :
            <CRow className='position-relative'>
              {startEnd != null && startEnd &&
                <TableDateSearch filterVal={allItems.filterVal} filterColumn={allItems.filterColumn}
                                 startEndUrl={startEndUrl} location={location.pathname} searchUrl={searchUrl}
                                 keyword={keyword} startDateRef={startDate} endDateRef={endDate}/>
              }
              {searchUrl != undefined &&
                <TableSearch location={location.pathname} searchUrl={searchUrl} keywordRef={keyword}
                             startDate={startDate} endDate={endDate}/>
              }
              {operations.select && selected.length != 0 &&
                <TableSelectRaw list={operations.select}/>
              }
              {advanceSearch != undefined &&
                <CCol className='mb-1 mt-2' sm={12}>
                  <AdvanceSearchTable location={location.pathname} keyword={keyword} startDate={startDate}
                                      endDate={endDate} currentPage={currentPage} url={url}
                                      advanceSearch={advanceSearch}/>
                </CCol>
              }
              <CCol className='mb-1' sm={12} lg={6} style={{direction:"rtl"}}>
                <CRow>
                  {operations.create.length != 0 ?
                    <CCol className="p-0">
                      <NavLink to={operations.create}>
                        <CButton className='w-25 text-white' style={{height: '38px'}}
                                 title={'Create'} color="success">Add  <i
                          className="text-center fa fa-plus" aria-hidden="true"></i></CButton>
                      </NavLink>
                    </CCol>
                    : ''}
                  {excel != null ?
                    <CCol sm={12} lg={6}>
                      <CButton className='m-1 w-100 text-white' style={{width: '40px', height: '40px'}}
                               title={'Excel'} color="info" onClick={(e) => setHasExcel(true)}>
                        <i className="text-center fa fa-download" aria-hidden="true"></i></CButton>
                    </CCol>
                    : ''}
                </CRow>
              </CCol>
              {/*Table*/}
              {datas.length != 0 ?
                <CCol sm={12} className='p-0 table-responsive-xl'>
                  <CTable striped style={{fontSize: '12px'}}>
                    <TableHead url={url} keyword={keyword} startDate={startDate} endDate={endDate} dyCol={dyCol}
                               dynamicCol={dynamicCol} columns={columns} info={info} location={location.pathname}
                               operations={operations} lastPage={lastPage} currentPage={currentPage}
                               filterVal={allItems.filterVal} filterColumn={allItems.filterColumn}/>
                    <TableBody isDelete={isDelete} datas={datas} operations={operations} switchUrl={switchUrl}
                               switchbox={switchbox} dynamicCol={dynamicCol} columns={columns} dyCol={dyCol}
                               info={info} detailUrl={detailUrl}
                               updateUrl={updateUrl} logingAs={logingAs} counter={counter}/>
                  </CTable>
                </CCol>

                :
                <p>{title} not found</p>
              }
            </CRow>
          }
          {!isLoading &&
            <>
              {lastPage > 1 && <>
                <Pagination page={currentPage} tableLoading={isLoading} lastPage={lastPage}
                            location={location.pathname} keyword={keyword}
                            startDate={startDate} endDate={endDate} operations={operations} columns={columns}
                            info={info} url={url} filterVal={allItems.filterVal} filterColum={allItems.filterColumn}/>
              </>}
              {hardDelete &&
                <CCol sm={12} style={{textAlign: 'right'}} className='mb-3'>
                  <CButton color='danger' style={{width: "15%"}} className='text-white' onClick={(e) => {
                    setIsHardDelete(true)
                  }}>Clear</CButton>
                </CCol>
              }
              {dynamicCol != null && dynamicCol != undefined &&
                <CCol sm={12} className={'bg-white mb-4 p-4'} style={{borderRadius: '10px', fontSize: '12px'}}>
                  <CRow>
                    {columns.map((item, index) =>
                      <CCol sm={2} key={index} className='my-1'>
                        <CRow>
                          <CCol sm={2} style={{paddingRight: '0'}}>
                            <input type='checkbox' checked={dyCol.includes(item)} style={{right: '5px', bottom: '1px'}}
                                   onChange={(e) => {
                                     changeColumns(item, dyCol.includes(item))
                                   }} className='m-1'/>
                          </CCol>
                          <CCol sm={10}>
                            {info[item]['column']}
                          </CCol>
                        </CRow>
                      </CCol>
                    )
                    }
                  </CRow>
                </CCol>
              }
            </>
          }
        </CRow>
      }
      {/*hard delete modal*/}
      <CModal visible={isHardDelete} onClose={() => setIsHardDelete(false)}>
        <CModalHeader onClose={() => setIsHardDelete(false)}>
          <CModalTitle>Remove</CModalTitle>
        </CModalHeader>
        <CModalBody>Do you want clear {title}?</CModalBody>
        <CModalFooter>
          <CButton onClick={() => {
            clickHardDelete(), setIsHardDelete(false)
          }} color="danger">Clear</CButton>
        </CModalFooter>
      </CModal>
      {/*delete modal*/}
      <DeleteModal filterVal={allItems.filterVal} filterColumn={allItems.filterColumn} isDelete={isDelete}
                   operations={operations} deleteUrl={deleteUrl} endDate={endDate}
                   startDate={startDate} removeId={removeId} keyword={keyword} currentPage={currentPage} url={url}/>
      {/*switcher modal*/}
      <SwitchBox isCheckBox={isCheckBox} switchUrl={switchUrl} switchItem={switchItem} switchbox={switchbox}/>
      {/*  other modals*/}
      {operations.hasModal.length != 0 &&
        <Modal operations={operations} hasModal={hasModal} id={modals.id} modalUrl={modalUrl} content={children}/>
      }
      {/*  export modal*/}
      {excel != null &&
        <ExportModal startEnd={startEnd} downloadUrl={exportUrl} excel={excel} hasModal={hasExcel} start={startDate}
                     end={endDate} csvStatus={csvStatus}
                     columns={columns} blacklistExport={blacklistExport} info={info}/>
      }
    </div>
  )
}
export default DataTable
