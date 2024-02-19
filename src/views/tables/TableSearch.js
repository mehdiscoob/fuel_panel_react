import React, {useEffect} from 'react';
import {changeLoading, getAllItems} from "../../actions/CrudActions";
import {CForm, CFormInput, CRow, CCol, CButton} from "@coreui/react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {cilSearch} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

function TableSearch({
                       keywordRef,
                       startDate,
                       endDate,
                       searchUrl,
                       location,
                     }) {
  let [keyword, setKeyword] = React.useState('');
  const {register, handleSubmit, watch, formState: {errors}} = useForm();
  const dispatch = useDispatch();


  const onSubmit = (data) => {
    window.history.pushState({page: 3}, 'new Page', '#' + location + '?page=' + '1' + (keyword != 0 ? '&keyword=' : '')
      + keyword +
      `${startDate.length != 0 && endDate.length != 0 ? '&startDate=' + startDate + "&endDate=" + endDate : ""}`)
    dispatch(changeLoading(true))
    dispatch(getAllItems(searchUrl, {keyword:keyword}))
  }
  useEffect(() => {
    setKeyword(keywordRef);
  }, [])
  return (
    <>
      <CCol sm={12} lg={6}>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CRow>
            <CCol sm={9} className='p-0 m-md-0'>
              <CFormInput {...register('keyword')} value={keyword} onChange={(e)=>{
                setKeyword(e.target.value)
              }}
                          placeholder='Search'/>
            </CCol>
            <CCol sm={3} className='mt-2 m-md-0' style={window.innerWidth > 600 ? {
              textAlign: 'right',
              WebkitPaddingEnd: 0
            } : {textAlign: 'center'}}>
              <CButton type='submit' color='primary' className='text-white w-100'><CIcon style={{width: "20px"}}
                                                                                         icon={cilSearch}
                                                                                         customClassName="nav-icon"/> Search</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
    </>
  );
}

export default TableSearch;
