import React, {useEffect, useState} from 'react';
import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CRow} from "@coreui/react";
import {useForm} from "react-hook-form";
import {httpPost} from "../../helper/httpMethods";
import moment from "jalali-moment";
import {useDispatch, useSelector} from "react-redux";
import {changeLoading, getAllItems} from "../../actions/CrudActions";
import {useParams, useSearchParams} from "react-router-dom";

function AdvanceSearchTable({
                              advanceSearch,
                              url,
                              startDate,
                              endDate,
                              currentPage,
                              keyword,
                              location,
                            }) {
  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.crud);
  const paginations = useSelector((state) => state.pagination);
  const sorting = useSelector((state) => state.sorting);
  let [column, setColumn] = useState("");
  let [value, setValue] = useState("");
  let [lock, setLock] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const {register, handleSubmit, watch, formState: {errors}} = useForm();
  let onSubmitssss = (data) => {
    setLock(true)
    let jalaiStart = '';
    let jalaiEnd = '';
    if (startDate.length != 0 && endDate.length != 0 && startDate != 'Invalid date' && endDate != 'Invalid date') {
      jalaiStart = moment(new Date(startDate)).locale('fa').format('YYYY/MM/DD')
      jalaiEnd = moment(new Date(endDate)).locale('fa').format('YYYY/MM/DD')
    }
    window.history.pushState({page: 3}, 'new Page', '#' + location + '?page=' + currentPage + `${jalaiStart.length != 0 && jalaiEnd.length != 0 ? '&startDate=' + jalaiStart + '&endDate=' + jalaiEnd : ""}` + `${keyword.length != 0 ? '&keyword=' + keyword : ""}` +
      `${sorting.order != null && sorting.orderColumn != null &&
      sorting.order.length != 0 && sorting.orderColumn.length != 0 ? ('&orderBy=' + sorting.order + '&orderColumn=' + sorting.orderColumn) : ""}` +
      `${column != null && value != null &&
      column.length != 0 && value.length != 0 ? ('&filterVal=' + value + '&filterColumn=' + column) : ""}`
    );
    data = {
      page: currentPage,
      keyword: keyword,
      startDate: startDate,
      endDate: endDate,
      orderBy: sorting.order,
      orderByColumn: sorting.orderColumn,
      filterColumn: column,
      filterVal: value,
    }
    dispatch(changeLoading(true))
    dispatch(getAllItems(url, data))

  }
  useEffect(()=>{
   // if (value!=null&&value.length==0&&column.length==0&&column!=null){
     setColumn(searchParams.get("filterColumn"));
     setValue(searchParams.get("filterVal"));
   // }
  },[])
  return (
    <>
      <CForm onSubmit={handleSubmit(onSubmitssss)}>
        <CRow>
          <CCol sm="12" md="5"
                style={{
                  padding: "0px",
                  paddingRight: window.innerWidth > 760 ? "1rem" : "0px"
                }}
          >
            <CFormLabel>Columns</CFormLabel>
            <CFormSelect value={column} onChange={(e)=>{setColumn(e.target.value)}}>
              <option value=""></option>
              {advanceSearch.map((item, index) =>
                  allItems.filterColumn == item['column'] ?
                    <option selected={true} key={index} value={item['column']}>{item['name']}</option>
                    :
                    <option key={index} value={item['column']}>{item['name']}</option>
              )}
            </CFormSelect>
          </CCol>
          <CCol sm="12" md="5" style={{
            padding: "0px",
            paddingLeft: window.innerWidth > 760 ? "1rem" : "0px"
          }}>
            <CFormLabel>Value</CFormLabel>
            <CFormInput value={value} onChange={(e)=>{setValue(e.target.value)}} />
          </CCol>
          <CCol sm="12" md="2" style={{
            padding: window.innerWidth > 760 ? "0px" : "0px 0.8rem",
            paddingLeft: window.innerWidth > 760 && "0.8rem"
          }}>
            <CFormLabel style={{opacity: "0"}}>a</CFormLabel>
            <br/>
            <CButton type="submit" className="w-100 text-white" color="secondary">Advance Search</CButton>
          </CCol>
        </CRow>
      </CForm>
    </>
  );
}

export default AdvanceSearchTable;
