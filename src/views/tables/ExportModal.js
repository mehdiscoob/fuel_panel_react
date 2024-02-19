import React, {useEffect, useState} from 'react'
import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow
} from "@coreui/react";
import {httpGet, httpPost} from "../../helper/httpMethods";
import {changeLoading, getAllItems, getItemById} from "../../actions/CrudActions";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {clickPagination, loadingPage, nextPage, otherPage, previousPage} from "../../actions/PaginationAction";
import {useSearchParams} from "react-router-dom";
import moment from "jalali-moment";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {useForm} from "react-hook-form";
import {exportModalStatus} from "../../actions/ExportModalAction";


const ExportModal = ({
                       hasModal,
                       start,
                       end,
                       csvStatus,
                       columns,
                       info,
                       excel,
                       downloadUrl,
                       startEnd,
                       blacklistExport,
                     }) => {
  const dispatch = useDispatch();
  const exportModals = useSelector((state) => state.exportModal);
  const {register: csvRegister, handleSubmit: csvHandleSubmit, formState: {csvErrors}} = useForm();
///state variables
  const [activeModal, setActiveModal] = useState(false)
  const [exportIsloading, setExportIsLoading] = useState(false)
  let [startDate, setStartDate] = React.useState("");
  let [endDate, setEndDate] = React.useState("");
  let [isLoading, setIsloading] = React.useState(false);
  let [exportUrl, setExportUrl] = React.useState('');
  ///useEffect
  useEffect(() => {
    httpGet(csvStatus).then((response) => {
      if (response.data.time) {
        if (response.data.status == 'processed') {
          setIsloading(false)
          setExportIsLoading(response.data.filename)
        } else if (response.data.status == 'processing') {
          setIsloading(true)
        } else if (response.data.status.includes('exception')) {
          setIsloading(false)
          setExportIsLoading(response.data.filename)
        }
      }
    }).catch((error) => {

    })
  }, [])
  useEffect(() => {
    setActiveModal(hasModal)
    dispatch(exportModalStatus(hasModal))
  }, [hasModal])
  useEffect(() => {
    setStartDate(start)
  }, [start])
  useEffect(() => {
    setEndDate(end)
  }, [end])
// functions
  const exportCsv = async (data) => {
    if (!data.columns || data.columns.length == 0) {
      return toast.warning('You should choose the Column')
    }
    if (((startDate == null || startDate.length == 0) || (endDate == null || endDate.length == 0)) && startEnd) {
      return toast.warning('Set timespan for export plaese')
    } else if ((new Date(startDate).getTime() > new Date(endDate).getTime()) && startEnd) {
      setEndDate('')
      return toast.error('Start Date can not be after of End Date')
    } else if ((new Date() < new Date(startDate)) && startEnd) {
      return toast.error('Start Date is ahead of Current Time')
    } else if ((new Date() < new Date(endDate)) && startEnd) {
      return toast.error('End Date is ahead of Current Time')
    } else if ((new Date(startDate).getTime() == new Date(endDate).getTime()) && startEnd) {
      startDate = startDate;
      endDate = endDate;
    }
    let diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    // if ((diff > 2678400000) && startEnd) {
    //   return toast.error('You can export Maximum 1 month Date')
    // }
    setExportIsLoading(true)
    await httpPost(excel, {startDate: startDate, endDate: endDate, columns: data.columns}).then((response) => {
      if (response == 'exception') {
        return toast.error('There is an Exception')
      }
      setIsloading(true)
      toast.success('Csv file is going to be maked')
      setTimeout(() => {
        toast.info('Click to Status for status checking')
      }, 1000)
      setExportIsLoading(false)
    }).catch((error) => {
      if (error.status == 422) {
        let messages = Object.keys(error.data.message).map((item) => {
          return error.data.message[item]
        });
        messages.map((item, index) => {
          toast.error(item[0])
        })
      } else {
        toast.error('There is an Exception')
      }
      setExportIsLoading(false)
    })
  }
  const exportStatus = async () => {
    await httpGet(csvStatus).then((response) => {
      let times = null;
      if (response.data.time) {
        times = moment(new Date(response.data.time)).locale('fa').format('YYYY/MM/DD HH:mm:ss');
        if (response.data.status.includes('exception')) {
          toast.error(`The CSV Report has an ${response.data.status} at ${times}`)
        } else {
          toast.info(`The CSV Report is ${response.data.status} at ${times}`)
        }

        if (response.data.status == 'processed') {
          setIsloading(false)
          response.data.filename.forEach((item, index) => {
            if (response.data.url != null && response.data.url.length != 0) {
              window.open(response.data.url + item, index + 1)
            } else {
              window.open(downloadUrl + item, index + 1)
            }
          })
        } else if (response.data.status.includes('exception')) {
          setIsloading(false)
        } else if (response.data.status == 'processing') {
          setIsloading(true)
        }
      }


    }).catch((error) => {

    })
  }
  return (
    <>
      <CModal size='xl' visible={activeModal} onClose={() => {
        dispatch(exportModalStatus(false))
      }}>
        <CModalHeader>
          <CModalTitle>Export CSV</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={csvHandleSubmit(exportCsv)}>
            <CRow>
              {startEnd &&
                <>
                  <CCol sm={12} lg={6}>
                    <div>Start:</div>
                    <DatePicker value={startDate.length != 0 ? new Date(startDate) : ''} calendar={persian}
                                locale={persian_fa} onChange={(e) => {
                      setStartDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                    }}/>
                  </CCol>
                  <CCol sm={12} lg={6}>
                    <div>To:</div>
                    <DatePicker value={endDate.length != 0 ? new Date(endDate) : ''} calendar={persian}
                                locale={persian_fa} onChange={(e) => {
                                  setEndDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                                }}/>
                  </CCol>
                </>
              }
              <CCol sm={12} className='mt-2'>
                <CRow>
                  <CCol sm={12}>
                    <h3>Columns</h3>
                  </CCol>
                  <hr/>
                  {columns.filter(q => !blacklistExport.includes(q)).map((item, index) =>
                    <CCol sm={2} key={index} className='my-1'>
                      <CRow>
                        <CCol sm={2} style={{paddingRight: '0'}}>
                          <input type='checkbox' {...csvRegister('columns')} value={item}
                                 style={{right: '5px', bottom: '1px'}} className='m-1'/>
                        </CCol>
                        <CCol sm={10}>
                          {(index + 1) + '. ' + info[item]['column']}
                        </CCol>
                      </CRow>
                    </CCol>
                  )
                  }
                  <CCol sm={12}>
                    <CRow>
                      <CCol sm={12} lg={6} style={{textAlign: 'left'}}>
                        <CButton className='mt-4 w-25' style={{color: 'white'}} color={"info"} onClick={(e) => {
                          exportStatus()
                        }}>Status</CButton>
                      </CCol>
                      <CCol sm={12} lg={6} style={{textAlign: 'right'}}>
                        <CButton type='submit' className='mt-4 w-25' style={{color: 'white'}}
                                 color={"success"}
                                 disabled={isLoading}
                        >
                          {!isLoading ? 'Export' : <CSpinner size='sm' color="light"/>}
                          {/*ok*/}
                        </CButton>
                      </CCol>
                    </CRow>

                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </form>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ExportModal
