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
  CSpinner, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CFormCheck
} from "@coreui/react";
import {httpGet} from "../../helper/httpMethods";
import {changeLoading, getAllItems, getItemById} from "../../actions/CrudActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clickPagination, loadingPage, nextPage, otherPage, previousPage} from "../../actions/PaginationAction";
import {useLocation, useSearchParams} from "react-router-dom";
import moment from "jalali-moment";
import {setOrder} from "../../actions/SortingAction";
import {fetchSelectData, statusSelectAll} from "../../actions/SelectActions";


const TableHead = ({
                     url,
                     keyword,
                     startDate,
                     endDate,
                     dynamicCol,
                     dyCol,
                     columns,
                     info,
                     operations,
                     lastPage,
                     currentPage,
                     location,
                     filterVal,
                     filterColumn
                   }) => {
  const [sorted, setSorted] = React.useState(null);
  const [selectAll, setSelectAll] = React.useState(false);
  const [sortedPosition, setSortedPosition] = React.useState('none');
  const [searchParams, setSearchParams] = useSearchParams();
  const sorting = useSelector((state) => state.sorting);
  let selectAllStatus = useSelector((state) => state.select);
  let allItems = useSelector((state) => state.crud);
  const dispatch = useDispatch();
  useEffect(() => {
    let orderBy = null;
    let orderColumn = null
    if (searchParams.get('orderColumn') != null) {
      orderBy = searchParams.get('orderBy')
      for (let i = 0; i < columns.length; i++) {
        if (info[columns[i]]['column'].toLowerCase() == searchParams.get('orderColumn').toLowerCase()) {
          orderColumn = columns[i]
        }
      }
    }
    if (sorting.orderColumn != null) {
      if (sorting.orderColumn.length != 0) {
        searchParams.set('orderColumn', info[sorting.orderColumn]['column'])
        orderColumn = sorting.orderColumn
      }
    }
    if (orderBy != null && orderColumn != null) {

      dispatch(setOrder(orderColumn, orderBy));
    }

  }, []);
  useEffect(() => {

    if (sorting.order != null && sorting.orderColumn != null) {
      if (sorting.order == 'desc') {
        setSortedPosition('down')
      } else if (sorting.order == 'asc') {
        setSortedPosition('up')
      }
      if (searchParams.get('orderColumn') != null) {
        if (searchParams.get('orderColumn') != sorting.orderColumn) {
          searchParams.set('orderColumn', info[sorting.orderColumn]['column'])
        }
        for (let i = 0; i < columns.length; i++) {
          if (info[columns[i]]['column'].toLowerCase() == searchParams.get('orderColumn').toLowerCase()) {

            setSorted(columns.indexOf(columns[i]))
          }
        }
      } else if (sorting.orderColumn != null) {
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].toLowerCase() == sorting.orderColumn.toLowerCase()) {
            setSorted(columns.indexOf(columns[i]))
          }
        }
      }


    }
  }, [sorting]);
  useEffect(() => {
    setSelectAll(selectAllStatus.selectAll)
  }, [selectAllStatus])
  return (
    <>
      <CTableHead>
        <CTableRow>
          {operations.select && <CTableHeaderCell scope="col"><CFormCheck checked={selectAll} onChange={(e) => {
            selectAll == false ? dispatch(statusSelectAll(!selectAll)) : dispatch(fetchSelectData([], !selectAll))
          }}/></CTableHeaderCell>}
          {operations.counter != null && <CTableHeaderCell scope="col">#</CTableHeaderCell>}
          {dynamicCol == null ? columns.map((item, index) =>
            <CTableHeaderCell key={index} scope="col">
              <div className='row position-relative mx-1 w-100'>
                <div className={(info[item]['isSorting'] != 'false' ? 'col-10' : 'col-12')} style={{
                  bottom: info[item]['isSorting'] != 'false' && '-18px',
                  height: '30px',
                  padding: "0px",
                  display: "inherit"
                }}>{info[item]['column']}
                  {info[item]['isSorting'] != "false" &&
                    <div style={{marginLeft: "4%"}}>
                      <div style={sorted == index && sortedPosition == 'up' ? {
                        bottom: '10px',
                        opacity: '0.2',
                        height: '7px',
                      } : {bottom: '10px', opacity: '1', height: '7px', padding: "0px"}} onClick={(e) => {
                        if (sortedPosition != 'up' && sorted != index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        } else if (sortedPosition == 'up' && sorted != index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        } else if (sortedPosition != 'up' && sorted == index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        }

                      }}><i style={{cursor: 'pointer'}} className="fa fa-sort-up"></i></div>
                      <div style={sorted == index && sortedPosition == 'down' ? {
                        bottom: '10px',
                        opacity: '0.2',
                        height: '7px',
                      } : {bottom: '10px', opacity: '1', height: '7px', padding: "0px"}}><i style={{cursor: 'pointer'}}
                                                                                            onClick={(e) => {
                                                                                              if (sortedPosition != 'down' && sorted != index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'desc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'desc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=desc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage))
                                                                                              } else if (sortedPosition == 'down' && sorted != index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'desc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'desc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=desc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage))
                                                                                              } else if (sortedPosition != 'down' && sorted == index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'desc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'desc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=desc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage));
                                                                                              }
                                                                                            }}
                                                                                            className="fa fa-sort-down"></i>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </CTableHeaderCell>
          ) : dyCol.length != 0 && dyCol.map((item, index) =>
            <CTableHeaderCell key={index} scope="col">
              <div className='row position-relative mx-1 w-100'>
                <div className={(info[item]['isSorting'] != 'false' ? 'col-10' : 'col-12')} style={{
                  bottom: info[item]['isSorting'] != 'false' && '-18px',
                  height: '30px',
                  padding: "0px",
                  display: "inherit"
                }}>{info[item]['column']}
                  {info[item]['isSorting'] != "false" &&
                    <div style={{marginLeft: "4%"}}>
                      <div style={sorted == index && sortedPosition == 'up' ? {
                        bottom: '10px',
                        opacity: '0.2',
                        height: '7px',
                      } : {bottom: '10px', opacity: '1', height: '7px', padding: "0px"}} onClick={(e) => {
                        if (sortedPosition != 'up' && sorted != index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        } else if (sortedPosition == 'up' && sorted != index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        } else if (sortedPosition != 'up' && sorted == index) {
                          setSorted(index)
                          setSortedPosition('up')
                          // dispatch(changeLoading(true))
                          dispatch(loadingPage(lastPage, 1))
                          dispatch(getAllItems(url, {
                            page: currentPage,
                            orderBy: 'asc',
                            orderByColumn: item,
                            keyword: keyword,
                            startDate: startDate,
                            endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                          }, operations.isDelete, operations.isDetail, operations.isUpdate));
                          searchParams.set('orderColumn', info[item]['column'])
                          searchParams.set('orderBy', 'asc')
                          window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                          dispatch(loadingPage(lastPage, currentPage))
                        }

                      }}><i style={{cursor: 'pointer'}} className="fa fa-sort-up"></i></div>
                      <div style={sorted == index && sortedPosition == 'down' ? {
                        bottom: '10px',
                        opacity: '0.2',
                        height: '7px',
                      } : {bottom: '10px', opacity: '1', height: '7px', padding: "0px"}}><i style={{cursor: 'pointer'}}
                                                                                            onClick={(e) => {
                                                                                              if (sortedPosition != 'down' && sorted != index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'desc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'desc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=desc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage))
                                                                                              } else if (sortedPosition == 'down' && sorted != index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'desc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'desc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=desc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage))
                                                                                              } else if (sortedPosition != 'down' && sorted == index) {
                                                                                                setSorted(index)
                                                                                                setSortedPosition('down');
                                                                                                // dispatch(changeLoading(true))
                                                                                                dispatch(loadingPage(lastPage, 1))
                                                                                                dispatch(getAllItems(url, {
                                                                                                  page: currentPage,
                                                                                                  orderBy: 'asc',
                                                                                                  keyword: keyword,
                                                                                                  orderByColumn: item,
                                                                                                  startDate: startDate,
                                                                                                  endDate: endDate,filterColumn:allItems.filterColumn,filterVal:allItems.filterVal
                                                                                                }, operations.isDelete, operations.isDetail, operations.isUpdate));
                                                                                                searchParams.set('orderColumn', info[item]['column'])
                                                                                                searchParams.set('orderBy', 'asc')
                                                                                                window.history.pushState({page: 1}, 'new Page', '/sh-admin/#' + location + '?page=' + currentPage + `${(keyword != null && keyword.length != 0) ? "&keyword=" + keyword : ""}` + `&orderBy=asc&orderColumn=${info[item]['column']}`+`${filterVal.length!=0 & filterColumn.length!=0?"&filterVal="+filterVal+"&filterColumn="+filterColumn:""}`);
                                                                                                dispatch(loadingPage(lastPage, currentPage));
                                                                                              }
                                                                                            }}
                                                                                            className="fa fa-sort-down"></i>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </CTableHeaderCell>
          )
          }
          {operations.isDelete || operations.isDetail || operations.isUpdate || operations.hasModal.length != 0 || operations.hasLink.length != 0 || operations.checked.length ?
            <CTableHeaderCell scope="col">Operations</CTableHeaderCell> : ''}
        </CTableRow>
      </CTableHead>
    </>
  )
}

export default TableHead
