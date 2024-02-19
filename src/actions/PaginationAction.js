import {changeLoading, getAllItems} from "./CrudActions";
import {toast} from "react-toastify";
import pagination, {PaginationAction} from "../reducers/PaginationReducer";

export const clickPagination = (page, currentPage, lastPage, location, keyword, url, countPage, operations,startDate,endDate,orderByColumn,order,filterVal,filterColumn) => {
  return async (dispatch) => {
    let data = {page: page, keyword: keyword, startDate: startDate, endDate: endDate,   orderBy: order,
      orderByColumn: orderByColumn,filterVal:filterVal,filterColumn:filterColumn}
    dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
    if(lastPage==page){
      if (lastPage>6){
        countPage=[];
        for (let i=0;i<=5;i++){
          let end=parseInt(lastPage)-5;
          countPage.push(end+i)
        }
      }
    }
      else
    if (page == countPage[countPage.length - 1]) {
      let lastOf = countPage[countPage.length - 1] + 1;
      let firstOf = countPage[0];
      let filtering = countPage.filter(page => page != firstOf)
       countPage = [...filtering, lastOf]
    }

    dispatch(PaginationAction.pagination({
      currentPage: page,
      lastPage: lastPage,
      countPage: countPage
    }))

  }
}
export const nextPage = (currentPage, lastPage, location, keyword, url, countPage, operations,startDate,endDate,orderByColumn,order,filterVal,filterColumn) => {
  return async (dispatch) => {
    if (currentPage == countPage[countPage.length - 1] && currentPage != lastPage) {
      let lastOf = countPage[countPage.length - 1] + 1;
      let firstOf = countPage[0];
      let filtering = countPage.filter(page => page != firstOf)
      countPage = [...filtering, lastOf]
    }
    let data = {keyword: keyword, page: (+currentPage + 1), startDate: startDate, endDate: endDate ,  orderBy: order,
      orderByColumn: orderByColumn,filterVal:filterVal,filterColumn:filterColumn}
    dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
    dispatch(PaginationAction.pagination({
      currentPage: (+currentPage + 1),
      lastPage: lastPage,
      countPage: countPage
    }))

  }
}
export const previousPage = (currentPage, lastPage, location, keyword, url, countPage, operations,startDate,endDate,orderByColumn,order,filterVal,filterColumn) => {
  return async (dispatch) => {
    if (currentPage > 6) {
      let lastOf = countPage[countPage.length - 1];
      let firstOf = countPage[0] - 1;
      let filtering = countPage.filter(page => page != lastOf)
      countPage = [firstOf, ...filtering]
    }
    if (countPage[0] == currentPage && currentPage != 1) {
      let pages = countPage;
      let pagesCount = [];
      pages.forEach((item, index) => {
        pagesCount.push(item - 1);
      })
      countPage = [...pagesCount]
    }

    let data = {keyword: keyword, page: (+currentPage - 1), startDate: startDate, endDate: endDate ,  orderBy: order,
      orderByColumn: orderByColumn,filterVal:filterVal,filterColumn:filterColumn}
    dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
    dispatch(PaginationAction.pagination({
      currentPage: (+currentPage - 1),
      lastPage: lastPage,
      countPage: countPage
    }))

  }
}
export const otherPage = (currentPage, lastPage,location,keyword,url,countPage,operations,startDate,endDate,orderByColumn,order,filterVal,filterColumn) => {
  return async (dispatch)=>{
    let data = {page: currentPage, keyword: keyword, startDate: startDate, endDate: endDate,orderBy: order,
      orderByColumn: orderByColumn,filterVal:filterVal,filterColumn:filterColumn}
    if (currentPage != lastPage) {
      let lastOf = countPage[countPage.length - 1] + 1;
      let firstOf = countPage[0];
      let filtering = countPage.filter(page => page != firstOf)
      countPage = [...filtering, lastOf];
    }
    dispatch(getAllItems(url, data, operations.isDelete, operations.isDetail, operations.isUpdate))
    dispatch(PaginationAction.pagination({
      currentPage: currentPage,
      lastPage: lastPage,
      countPage: countPage
    }))
}
}
export const loadingPage = (lastPage, currentPage) => {
  return async (dispatch) => {
    let thisPage = parseInt(currentPage);
    let countPage = [1];
    if (lastPage > 6 && lastPage != 0) {
      // searchParams.get('get') != null && setCurrentPage(searchParams.get("page"))
      if (currentPage + 5 < lastPage) {
        countPage = ([thisPage, thisPage + 1, thisPage + 2, thisPage + 3, thisPage + 4, thisPage + 5])
      } else {
        let diff = lastPage - thisPage;
        let remainPages = [];
        for (let i = 1; i < (6 - diff); i++) {
          let diff2 = 6 - diff - i;
          remainPages.push((thisPage - diff2))

        }
        for (let i = 0; i <= diff; i++) {
          remainPages.push((thisPage + i))
        }
        countPage = remainPages;
      }
    } else {
      let pages = []
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }

      countPage = pages;
    }
    dispatch(PaginationAction.pagination({
      currentPage: currentPage,
      lastPage: lastPage,
      countPage: countPage,
      isLoading: true,
    }))
  }
}
