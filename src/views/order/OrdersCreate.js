import React, {useEffect, useState} from 'react'

import {
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CFormTextarea,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter, CLink
} from '@coreui/react'
import {httpGet, httpPost} from "../../helper/httpMethods";
import 'react-quill/dist/quill.snow.css';
import '../../scss/editor.css';
import parse from 'html-react-parser'
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import 'src/scss/datePicker.scss';
import moment from "jalali-moment";
import Select from "react-select";
import st from "react-datepicker";
import {isEmpty} from "../../helper/utility";
import axios from "axios";
import ReactQuill from "react-quill";
import {NavLink} from "react-router-dom";

const ordersCreate = () => {
  const navigate = useNavigate();
  let [submitLoading, setSubmitLoading] = React.useState(false);
  let [clientChecked, setClientChecked] = React.useState(false);
  let [clientCheckLoading, setClientCheckLoading] = React.useState(false);
  let [error, setError] = React.useState({});
  let [clientName, setClientName] = React.useState("");
  let [data, setData] = React.useState({
    client_id: "",
    address: "",
    amount: 0,
    type: "user",
  });
  const {register, handleSubmit, watch, formState: {errors}} = useForm();


  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
      '-' + (mm > 9 ? '' : '0') + mm,
      '-' + (dd > 9 ? '' : '0') + dd
    ].join('');
  };

  const clientCheck = () => {
    let errors = {};
    if (clientName.length == 0) errors['client_id'] = ["Client Name is required."];
    if (!isEmpty(errors)) {
      setError(errors)
      return;
    }
    setClientCheckLoading(true)
    httpGet('api/client/checked', {params:{mobile:clientName}}).then((res) => {
      if (!res.data){
        setError([])
        setClientChecked(false)
        errors['client_id'] = ["Client is not existed."];
        setError(errors)
      }else {
        setError([])
        let newData=data;
        newData["client_id"]=res.data.id;
        setClientChecked(true)
      }
      setClientCheckLoading(false);
    }).catch((r) => {
      setClientCheckLoading(false);
      setClientChecked(false)
    })
  }

  const onSubmit = () => {
    let errors = {};
    if (data.amount == 0 || isNaN(data.amount)) errors['amount'] = ["Amount must be at least 1"];
    if (!clientChecked) errors['client_id'] = ["There is no Client"];
    if (data.address.length==0) errors['address'] = ["Address is required"];
    if (!isEmpty(errors)) {
      setError(errors)
      return;
    }
    setSubmitLoading(true)
    httpPost('api/order', data).then((res) => {
      toast.success('Order was Created.');
      setSubmitLoading(false)
      setTimeout(() => {
        // navigate('/order/')
      }, 1500)
    }).catch((r) => {
      setSubmitLoading(false)
    })
  }

  useEffect(()=>{
    let newData=data;
    let user=JSON.parse(localStorage.getItem("admin_user"));
    if (user.type!=undefined&&user.type=="client"){
      newData["client_id"]=user.id;
    }
  },[])

  return (
    <div>
      <CContainer>
        <ToastContainer/>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CRow className="align-items-start">
            <CCol className='my-1' sm={12}>
              <CRow className="align-items-start">
                <CCol className='my-1' sm={12} lg={6} style={{paddingLeft: '0px'}}>
                  <CRow className="align-items-start">
                    <CCol className='my-1' sm={12}>
                      Amount(Litre)*:
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <CFormInput type={"number"} min={0}
                                  style={{border: error.amount != undefined && "2px solid red"}}
                                  value={data["amount"]} onChange={(e) => {
                        let newData = data;
                        newData["amount"] = parseInt(e.target.value);
                        setData({...newData})
                      }} placeholder='Amount'/>
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <ul style={{color: "red", fontSize: "16px"}}>
                        {error.amount != undefined &&
                          error.amount.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        }
                      </ul>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol className='my-1' sm={12} lg={6} style={{paddingLeft: '0px'}}>
                  <CRow className="align-items-start">
                    <CCol className='my-1' sm={12}>
                      Client*:
                    </CCol>
                    <CCol className='my-1' sm={12} style={{position:"relative"}}>
                      <CFormInput
                                  style={{border: error.client_id != undefined && "2px solid red"}}
                                  value={clientName} onChange={(e) => {
                        setClientName(e.target.value)
                      }} placeholder='Client'/>
                      <CButton
                        disabled={clientCheckLoading}
                        color="secondary"
                        style={{
                          position: 'absolute',
                          color: 'white',
                          right: '20px',
                          top: '5px', // Adjust as needed for button position
                          height: '30px',
                          padding: 'inherit',
                        }}
                        onClick={()=>{clientCheck()}}
                      >
                        Check
                      </CButton>
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <ul style={{color: "red", fontSize: "16px"}}>
                        {error.client_id != undefined ?
                          error.client_id.map((item, index) => (
                            <li key={index}>{item}</li>
                          )): clientChecked &&
                          <li style={{color:"#4dc374"}}>Client is checked</li>
                        }
                      </ul>

                    </CCol>
                  </CRow>
                </CCol>
                <CCol className='my-1' sm={12} style={{paddingLeft: '0px'}}>
                  <CRow className="align-items-start">
                    <CCol className='my-1' sm={12}>
                      Address*:
                    </CCol>
                    <CCol className='my-1' sm={12} style={{position:"relative"}}>
                      <CFormTextarea
                                  style={{border: error.address != undefined && "2px solid red"}}
                                  value={data["address"]} onChange={(e) => {
                        let newData = data;
                        newData["address"] = e.target.value;
                        setData({...newData})
                      }} placeholder='Address'/>
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <ul style={{color: "red", fontSize: "16px"}}>
                        {error.address != undefined &&
                          error.address.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        }
                      </ul>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol sm={2} className={"p-0"}>
                  <CButton type='submit' title={'Save'} name='dataTable' className='text-white w-100'
                           color="success"
                           disabled={submitLoading}>             {!submitLoading ? 'Submit' :
                    <CSpinner size='sm' color="light"/>}</CButton>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </div>


  )
}

export default ordersCreate
