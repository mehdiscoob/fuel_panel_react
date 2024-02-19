import React, {useEffect} from 'react';
import {toast} from "react-toastify";
import {changeLoading, getAllItems} from "../../actions/CrudActions";
import {useForm} from "react-hook-form";
import {CForm, CFormInput,CRow,CCol,CButton} from "@coreui/react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import moment from "jalali-moment";
import persian_fa from "react-date-object/locales/persian_fa"
import {useDispatch} from "react-redux";
import CIcon from "@coreui/icons-react";
import {cilSearch} from "@coreui/icons";
function TableDateSearch(
  {
    startDateRef,
    endDateRef,
    startEndUrl,
    keyword,
    location
  }
) {
  const {register: dateRegister, handleSubmit: dateHandleSubmit, formState: {dateErrors}} = useForm();
  const dispatch = useDispatch();
  let [startDate, setStartDate] = React.useState("");
  let [endDate, setEndDate] = React.useState("");
  let [inputStartDate, setInputStartDate] = React.useState("");
  let [inputEndDate, setInputEndDate] = React.useState("");
  const onSubmitDate = (data) => {
    window.history.pushState(1, 'new Page', '#' + location + '?page=1' + `${keyword.length!=0 ? '&keyword=' + keyword:''}` +(inputStartDate? '&startDate=' + inputStartDate:'')+ (inputEndDate?'&endDate=' + inputEndDate:''))
    if (startDate.length == 0) {
      return toast.error('Start Date is Required')
    }
    if (endDate.length == 0) {
      return toast.error('End Date is Required')
    }
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      setEndDate('')
      return toast.error('Start Date can not be after of End Date')
    }
    if (new Date() < new Date(startDate)) {
      return toast.error('Start Date is ahead of Current Time')
    }
    if (new Date() < new Date(endDate)) {
      return toast.error('End Date is ahead of Current Time')
    }
    dispatch(changeLoading(true))
    let startEndData = {page: 1, startDate: startDate, endDate: endDate}
    dispatch(getAllItems(startEndUrl, startEndData))
  }
  useEffect(()=>{
    setEndDate(endDateRef);
    if (endDateRef!=null && endDateRef.length!=0){
      setInputEndDate(moment(new Date(endDateRef).yyyymmdd()).locale('fa').format('YYYY/MM/DD'))

    }
    setStartDate(startDateRef);
    if (startDateRef!=null && startDateRef.length!=0){
      setInputStartDate(moment(new Date(startDateRef).yyyymmdd()).locale('fa').format('YYYY/MM/DD'))

    }
  },[])
  return (
    <>
      <CCol sm={12} className='mb-1' style={{paddingRight: '0px'}}>
        <CForm onSubmit={dateHandleSubmit(onSubmitDate)}>
          <CRow>
            <CCol sm={12} lg={5} style={{padding:"0px",
              paddingRight:window.innerWidth>760?"1rem":"0px"}}>
              <div>Start:</div>
              <DatePicker value={startDate.length != 0 ? new Date(startDate) : ''} onChange={(e) => {
                setStartDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                // setInputStartDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                setInputStartDate(moment(new Date(e.unix * 1000).yyyymmdd()).locale('fa').format('YYYY/MM/DD'))
              }
              } calendar={persian} locale={persian_fa}/>
            </CCol>
            <CCol sm={12} lg={5}>
              <div>End:</div>
              <DatePicker value={endDate.length != 0 ? new Date(endDate) : ''} onChange={(e) => {
                setEndDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                setInputEndDate(moment(new Date(e.unix * 1000).yyyymmdd()).locale('fa').format('YYYY/MM/DD'))
              }
              } calendar={persian} locale={persian_fa}/>
            </CCol>
            <CCol sm={12} lg={2} style={{padding:window.innerWidth>760?"0px":"0px 0.8rem",
              paddingRight:window.innerWidth>760&&"0.8rem"}}>
              <div style={{opacity: '0'}}> s</div>
              <CButton type='submit' className='text-white w-100' color='success'><CIcon icon={cilSearch} customClassName="nav-icon"/> Search</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
    </>
  );
}

export default TableDateSearch;
