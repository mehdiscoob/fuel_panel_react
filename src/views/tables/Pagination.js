import React, {useEffect, useState} from 'react'
import {CCol, CPagination, CPaginationItem, CRow} from "@coreui/react";
import {httpGet} from "../../helper/httpMethods";
import {changeLoading, getAllItems} from "../../actions/CrudActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clickPagination, loadingPage, nextPage, otherPage, previousPage} from "../../actions/PaginationAction";
import {useSearchParams} from "react-router-dom";
import {setOrder} from "../../actions/SortingAction";
import moment from "jalali-moment";
import {statusSelectAll} from "../../actions/SelectActions";


const Pagination = ({
                      lastPage,
                      page,
                      keyword,
                      startDate,
                      endDate,
                      url,
                      location,
                      operations,
                      info,
                      columns,
                      filterVal,
                      filterColumn,
                    }) => {
  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.crud);
  const paginations = useSelector((state) => state.pagination);
  const sorting = useSelector((state) => state.sorting);
  const [searchParams, setSearchParams] = useSearchParams();
///state variables
  let [currentPage, setCurrentPage] = React.useState(parseInt(page));
  // let [lastPage, setLastPage] = React.useState(1);
  let [countPage, setCountPage] = React.useState([1]);
  let [orderSort, setOrderSort] = React.useState('');
  let [orderColumnSort, setOrderColumnSort] = React.useState('');
  let [columnOrder, setColumnOrder] = React.useState('');
  ///useEffect
  useEffect(() => {
    setCurrentPage(parseInt(page))
  }, [page])
  if (lastPage => 1) {
    useEffect(() => {
      if (paginations.lastPage != lastPage) {
        dispatch(loadingPage(lastPage, parseInt(currentPage)))
      }
    }, [lastPage])
  }

  useEffect(() => {
    setCountPage(paginations.countPage)
    setCurrentPage(paginations.currentPage)
    searchParams.set("page", paginations.currentPage)
  }, [paginations])


  useEffect(() => {

    searchParams.set('orderColumn', sorting.orderColumn)
    searchParams.set('orderBy', sorting.order)
    setOrderSort(sorting.order)
    setOrderColumnSort(sorting.orderColumn)

    if (searchParams.get('orderColumn') != null) {
      for (let i = 0; i < columns.length; i++) {
        if (info[columns[i]]['column'].toLowerCase() == searchParams.get('orderColumn').toLowerCase()) {
          setColumnOrder(columns[i])
        }
      }
    } else if (sorting.orderColumn != null) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].toLowerCase() == sorting.orderColumn.toLowerCase()) {
          setColumnOrder(columns[i])
        }
      }
    }

  }, [sorting])


  ///functions
  const urlParams = (page, keyword) => {
    let jalaiStart = '';
    let jalaiEnd = '';
    if (startDate.length != 0 && endDate.length != 0 && startDate != 'Invalid date' && endDate != 'Invalid date') {
      jalaiStart = moment(new Date(startDate)).locale('fa').format('YYYY/MM/DD')
      jalaiEnd = moment(new Date(endDate)).locale('fa').format('YYYY/MM/DD')
    }
    window.history.pushState({page: 3}, 'new Page', '#' + location + '?page=' + page + `${jalaiStart.length != 0 && jalaiEnd.length != 0 ? '&startDate=' + jalaiStart + '&endDate=' + jalaiEnd : ""}` + `${keyword.length != 0 ? '&keyword=' + keyword : ""}` +
      `${orderSort != null && orderColumnSort != null && orderSort.length != 0 && orderColumnSort.length != 0 ? ('&orderBy=' + orderSort + '&orderColumn=' + info[orderColumnSort]["column"]) : ""}` + '&filterVal=' + filterVal + "&filterColumn=" + allItems.filterColumn);
  }
  const pagination = async (e, page) => {
    dispatch(statusSelectAll(false))
    urlParams(page, keyword)
    dispatch(changeLoading(true))
    if (page != currentPage) {
      dispatch(clickPagination(page, currentPage, lastPage, location, keyword, url, countPage, operations, startDate, endDate, sorting.orderColumn, sorting.order, filterVal, allItems.filterColumn))
    }
  }


  const nextPages = async () => {
    dispatch(statusSelectAll(false))
    urlParams((+currentPage + 1), keyword)
    if (currentPage != lastPage) {
      dispatch(changeLoading(true));
      dispatch(nextPage(currentPage, lastPage, location, keyword, url, countPage, operations, startDate, endDate, sorting.orderColumn, sorting.order, filterVal, allItems.filterColumn))
    }

  }
  const previousPages = async () => {
    dispatch(statusSelectAll(false))
    urlParams((+currentPage - 1), keyword)
    if (currentPage != 1) {
      dispatch(changeLoading(true));
      dispatch(previousPage(currentPage, lastPage, location, keyword, url, countPage, operations, startDate, endDate, sorting.orderColumn, sorting.order, filterVal, allItems.filterColumn))
    }

  }
  const otherPages = async () => {
    dispatch(statusSelectAll(false))
    urlParams((+countPage[countPage.length - 1] + 1), keyword)
    if ((+countPage[countPage.length - 1] + 1) != lastPage) {
      dispatch(changeLoading(true));
      dispatch(otherPage((+countPage[countPage.length - 1] + 1), lastPage, location, keyword, url, countPage, operations, startDate, endDate, sorting.orderColumn, sorting.order, filterVal, allItems.filterColumn))
    }
  }
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
  const clickLastPage = async () => {
    let pages = []
    if (lastPage <= 6) {

      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }

      setCountPage(pages)
    } else {

      for (let i = 1; i <= 6; i++) {
        pages.push(lastPage - 6 + i)
      }
      setCountPage(pages)
    }
  }
  return (
    <>
      <CPagination align="center" aria-label="Page navigation example">
        <CPaginationItem style={{cursor: 'pointer'}} aria-label="Previous" onClick={(e) => {
          previousPages();
        }}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {countPage.length != 0 &&
          countPage.map((item) => (
            <CPaginationItem style={{cursor: 'pointer'}} key={item} onClick={(e) => {
              pagination(e, item);
            }}
                             className={currentPage == item && 'active'}>{item}</CPaginationItem>
          ))
        }
        {lastPage > 6 && currentPage + 5 < lastPage &&
          <>
            {currentPage + 6 < parseInt(lastPage) &&
              <CPaginationItem style={{cursor: 'pointer'}} onClick={(e) => {
                otherPages()
              }}>...</CPaginationItem>
            }
            <CPaginationItem style={{cursor: 'pointer'}} key={lastPage} onClick={(e) => {
              clickLastPage();
              pagination(e, lastPage);
              setCurrentPage(lastPage)
            }}
                             className={currentPage == lastPage && 'active'}>{lastPage}</CPaginationItem>
          </>
        }

        <CPaginationItem style={{cursor: 'pointer'}} aria-label="Next" onClick={(e) => {
          nextPages();
        }}>
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>
      <div style={{textAlign: 'center'}}>  {currentPage} of {lastPage} </div>


    </>
  )
}

export default Pagination
