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
import {httpGet, httpPost, httpPut} from "../../helper/httpMethods";
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
import {getDuration} from "../../helper/audioFile";
import st from "react-datepicker";
import {isEmpty} from "../../helper/utility";
import {NavLink, useLocation} from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import {array} from "prop-types";

const campaignsCreate = () => {
  const navigate = useNavigate();
  const thisLoc = useLocation().pathname;
  const arrayParam = thisLoc.split('/')
  const campaignId = arrayParam[3];
  localStorage.setItem('breadcrumbs', [JSON.stringify({
    pathname: '/user/users-table/',
    name: 'جدول کامنت ها',
    active: false
  }), JSON.stringify({pathname: '/user/user-update/', name: 'ویرایش کامنت', active: true})])
  let [isLoading, setIsLoading] = React.useState(true);
  let [submitLoading, setSubmitLoading] = React.useState(false);
  let [draftLoading, setDraftLoading] = React.useState(false);
  let [campaignCoverLoading, setCampaignCoverLoading] = React.useState(false);
  let [campaignAudioLoading, setCampaignAudioLoading] = React.useState(false);
  let [brandCoverLoading, setBrandCoverLoading] = React.useState(false);
  let [runLoading, setRunLoading] = React.useState(false);
  let [isStart, setIsStart] = React.useState('now');
  let [isEnd, setIsEnd] = React.useState('no');
  let [podcastCategories, setPodcastCategories] = React.useState([]);
  let [audioBookCategories, setAudioBookCategories] = React.useState([]);
  let [musicCategories, setMusicCategories] = React.useState([]);
  let [podcastCategoriesDefault, setPodcastCategoriesDefault] = React.useState([]);
  let [audioBookCategoriesDefault, setAudioBookCategoriesDefault] = React.useState([]);
  let [musicCategoriesDefault, setMusicCategoriesDefault] = React.useState([]);
  let [podcastCatSelected, setPodcastCatSelected] = React.useState([]);
  let [audioBookCatSelected, setAudioBookCatSelected] = React.useState([]);
  let [musicCatSelected, setMusicCatSelected] = React.useState([]);
  let [title, setTitle] = React.useState("");
  let [brandName, setBrandName] = React.useState("");
  let [link, setLink] = React.useState("");
  let [linkName, setLinkName] = React.useState("");
  let [times, setTimes] = React.useState("");
  let [content, setContent] = React.useState("");
  let [error, setError] = React.useState({});
  let [assetBrandCover, setAssetBrandCover] = React.useState("");
  let [assetCampaignCover, setAssetCampaignCover] = React.useState("");
  let [assetCampaignAudio, setAssetCampaignAudio] = React.useState("");
  let [status, setStatus] = React.useState("");
  const [brandCover, setBrandCover] = useState(`<svg width="200" height="200" viewBox="0 0 123 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M117.404 0.303081C118.87 0.286672 120.284 0.853308 121.333 1.87848C122.383 2.90366 122.982 4.3035 123 5.77043V93.2296C122.982 94.6965 122.383 96.0964 121.333 97.1215C120.284 98.1467 118.87 98.7133 117.404 98.6969H5.5965C4.12955 98.7133 2.7161 98.1467 1.66671 97.1215C0.617315 96.0964 0.0178387 94.6965 0 93.2296L0 5.77658C0.00803157 5.0497 0.159165 4.33152 0.444771 3.66306C0.730377 2.99459 1.14486 2.38893 1.66455 1.88066C2.18424 1.37239 2.79897 0.971464 3.47361 0.700782C4.14826 0.430099 4.86962 0.29496 5.5965 0.303081H117.404ZM33.3084 39.7676L8.3394 64.6259V90.5605H114.636V81.7475L94.956 62.5595L77.8774 76.9075C76.8566 77.627 75.8726 77.9407 74.9254 77.8607C73.9273 77.7606 72.9844 77.3546 72.2256 76.6984L33.3084 39.7676ZM114.611 8.48873H8.3763V52.9532L30.5532 30.8686C31.3232 30.2563 32.2755 29.9186 33.2592 29.9092C34.2125 29.9092 35.0489 30.1982 35.7807 30.7702L75.3314 68.2114L92.5821 53.7589C93.3252 53.1871 94.2337 52.872 95.1713 52.861C96.1028 52.868 97.0062 53.1814 97.742 53.7527L114.605 70.1425V8.48258L114.611 8.48873ZM93.9289 20.1676C98.5599 20.1676 102.311 23.8391 102.311 28.3655C102.311 32.8919 98.5599 36.5635 93.9289 36.5635C89.2918 36.5635 85.5404 32.8919 85.5404 28.3655C85.5404 23.8391 89.2918 20.1676 93.9289 20.1676Z" fill="#D3D3D3"/>
                            </svg>`);
  const [campaignCover, setCampaignCover] = useState(`<svg width="200" height="200" viewBox="0 0 123 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M117.404 0.303081C118.87 0.286672 120.284 0.853308 121.333 1.87848C122.383 2.90366 122.982 4.3035 123 5.77043V93.2296C122.982 94.6965 122.383 96.0964 121.333 97.1215C120.284 98.1467 118.87 98.7133 117.404 98.6969H5.5965C4.12955 98.7133 2.7161 98.1467 1.66671 97.1215C0.617315 96.0964 0.0178387 94.6965 0 93.2296L0 5.77658C0.00803157 5.0497 0.159165 4.33152 0.444771 3.66306C0.730377 2.99459 1.14486 2.38893 1.66455 1.88066C2.18424 1.37239 2.79897 0.971464 3.47361 0.700782C4.14826 0.430099 4.86962 0.29496 5.5965 0.303081H117.404ZM33.3084 39.7676L8.3394 64.6259V90.5605H114.636V81.7475L94.956 62.5595L77.8774 76.9075C76.8566 77.627 75.8726 77.9407 74.9254 77.8607C73.9273 77.7606 72.9844 77.3546 72.2256 76.6984L33.3084 39.7676ZM114.611 8.48873H8.3763V52.9532L30.5532 30.8686C31.3232 30.2563 32.2755 29.9186 33.2592 29.9092C34.2125 29.9092 35.0489 30.1982 35.7807 30.7702L75.3314 68.2114L92.5821 53.7589C93.3252 53.1871 94.2337 52.872 95.1713 52.861C96.1028 52.868 97.0062 53.1814 97.742 53.7527L114.605 70.1425V8.48258L114.611 8.48873ZM93.9289 20.1676C98.5599 20.1676 102.311 23.8391 102.311 28.3655C102.311 32.8919 98.5599 36.5635 93.9289 36.5635C89.2918 36.5635 85.5404 32.8919 85.5404 28.3655C85.5404 23.8391 89.2918 20.1676 93.9289 20.1676Z" fill="#D3D3D3"/>
                            </svg>`);
  const [campaignAudio, setCampaignAudio] = useState(``);
  const uploadbrandCover = async (e) => {
    let exception = false;
    if (!e.target.files[0].type.includes('image')) {
      e.target.value = ''
      return toast.error('The Type of File is Not Valid')
    }
    if (e.target.files[0].size > 67224) {
      e.target.value = ''
      return toast.error('Size of Photo too Long')
    }
    setBrandCoverLoading(true)
    let request = new FormData();
    request.append("file", e.target.files[0])
    await httpPost(coreUrl+"api/asset/admin/upload", request).then((e) => {
      setBrandCoverLoading(false)
      setAssetBrandCover(e.data.id)
    }).catch((e) => {
      exception = true
      setBrandCoverLoading(false)
    })
    if (exception) return
    let reader = new FileReader();
    reader.onload = (ev) => {
      setBrandCover(`
<img className='bg-white text-secondary' style="height:200px;;width:200px;textAlign:center;border-radius: 10px" src="${ev.target.result}">
`);
    };
    reader.readAsDataURL(e.target.files[0]);
  }
  const uploadCampaignCover = async (e) => {
    let exception = false;
    if (!e.target.files[0].type.includes('image')) {
      e.target.value = ''
      return toast.error('The Type of File is Not Valid')
    }
    if (e.target.files[0].size > 128321) {
      e.target.value = ''
      return toast.error('Size of Photo too Long')
    }
    setCampaignCoverLoading(true)
    let request = new FormData();
    request.append("file", e.target.files[0])
    await httpPost(coreUrl+"api/asset/admin/upload", request).then((e) => {
      setCampaignCoverLoading(false)
      setAssetCampaignCover(e.data.id)
    }).catch((e) => {
      setCampaignCoverLoading(false)
      exception = true
    })
    if (exception) return
    let reader = new FileReader();
    reader.onload = (ev) => {
      setCampaignCover(`
<img className='bg-white text-secondary' style="height:200px;;width:200px;textAlign:center;border-radius: 10px" src="${ev.target.result}">
`);
    };
    reader.readAsDataURL(e.target.files[0])
  }
  const uploadCampaignAudio = async (e) => {
    let exception = false
    if (!e.target.files[0].type.includes('mpeg')) {
      e.target.value = ''
      toast.error('The Type of File should be mp3')
      return "hi"
    }
    let duration = await getDuration(e.target.files[0]);
    if (duration > 61) {
      e.target.value = ''
      return toast.error('The maximum duration should be 15 seconds')
    }
    setCampaignAudioLoading(true)
    let request = new FormData();
    request.append("file", e.target.files[0])
    await httpPost(coreUrl+"api/asset/admin/upload", request).then((e) => {
      setCampaignAudioLoading(false)
      setAssetCampaignAudio(e.data.id)
    }).catch((e) => {
      setCampaignAudioLoading(false)
      exception = true
    })
    if (exception) return
    let reader = new FileReader();
    reader.onload = (ev) => {
      setCampaignAudio(``);
      setTimeout(()=>{
        setCampaignAudio(`
<audio controls class="m-auto my-2" style="padding: 10px 15px;width: 100%" controlsList="nodownload noplaybackrate">
<source src="${ev.target.result}" type="audio/mpeg">
</audio>
`);
      },100)

    };
    reader.readAsDataURL(e.target.files[0])
  }
  let Editormodules = {
    toolbar: [[{'header': [1, 2, false]}], ['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], ['link'], [{align: ['', 'right', 'center', 'justify']}, {"direction": 'rtl'}]],
  }
  const {register, handleSubmit, watch, formState: {errors}} = useForm();
  const dispatch = useDispatch();
  let baseUrl = process.env.REACT_APP_API_URL;
  let coreUrl = process.env.REACT_APP_CORE_API_URL;
  const categoryURL = process.env.REACT_APP_CORE_API_URL+'api/categories';
  const localCategoryURL = baseUrl + "api/mss/local/category";
  const localCategoryByCategoryId = localCategoryURL + "/sub/";
  const campaignURL = 'api/ads/campain/' + campaignId;
  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
      '-' + (mm > 9 ? '' : '0') + mm,
      '-' + (dd > 9 ? '' : '0') + dd
    ].join('');
  };
  let [endDate, setEndDate] = React.useState("");
  let [startDate, setStartDate] = React.useState(new Date().yyyymmdd());
  React.useEffect(() => {
    httpGet(categoryURL).then((response) => {
      let audioBookPack = [];
      let musicPack = [];
      audioBookPack.push({value: "all", label: "همه موارد"})
      musicPack.push({value: "all", label: "همه موارد"})
      response.data.audio_book.map((item, index) => {
        audioBookPack.push({value: item.id, label: item.title})
      })
      response.data.music.map((item, index) => {
        musicPack.push({value: item.id, label: item.title})
      })
      setAudioBookCategories(audioBookPack)
      setMusicCategories(musicPack);
      httpGet(localCategoryURL).then((responseLoc) => {
        let podcastPack = [];
        podcastPack.push({value: "all", label: "همه موارد"});
        responseLoc.data.map((item, index) => {
          podcastPack.push({value: item.id, label: item.title})
        });
        setPodcastCategories(podcastPack)
        httpGet(campaignURL).then((res) => {
          let data = res.data;
          let catChoosed = res.data.categories && res.data.categories.length != 0 ? JSON.parse("[" + res.data.categories + "]") : "";
          let catPodcast = [];
          let catAudioBook = [];
          let catMusic = [];
          let catPodcastDefault = [];
          let catAudioBookDefault = [];
          let catMusicDefault = [];
          setTitle(data.title);
          setTimes(data.times);
          setLink(data.link);
          setLinkName(data.link_name);
          setBrandName(data.brand_name);
          setContent(data.content);
          setStartDate(data.start_date)
          setStatus(data.status)
          new Date().yyyymmdd() != data.start_date && setIsStart("select")
          data.end_date != null && setEndDate(data.end_date)
          data.campain_cover && setCampaignCover(`<img className='bg-white text-secondary' style="height:200px;;width:200px;textAlign:center;border-radius: 10px" src="${data.campain_cover}">`)
          data.brand_cover && setBrandCover(`<img className='bg-white text-secondary' style="height:200px;;width:200px;textAlign:center;border-radius: 10px" src="${data.brand_cover}">`)
          data.campaign_audio && setCampaignAudio(`
<audio controls class="m-auto my-2" style="padding: 10px 15px;width: 100%" controlsList="nodownload noplaybackrate">
<source src="${data.campaign_audio}" type="audio/mpeg">
</audio>
`);

          if (catChoosed.length != 0) {
            let oneCat=catChoosed.filter(q=>q.entity_type=="podcast").map((i)=>i.id);
            if (oneCat.length!=0){
              httpGet(localCategoryByCategoryId,{params:{ids:oneCat}}).then((resBy) => {
                resBy.data.map((item)=>{
                  catPodcast.push(item.id)
                  catPodcastDefault.push({value: item.id, label: item.title})
                })
                setPodcastCatSelected([...catPodcast]);
                setPodcastCategoriesDefault(catPodcastDefault);
              });
            }
            catChoosed.map((item, index) => {
             if (item.entity_type == "audio_book") {
                catAudioBook.push(item.id)
                catAudioBookDefault.push({value: item.id, label: item.title})
              } else if (item.entity_type == "music") {
                catMusic.push(item.id)
                catMusicDefault.push({value: item.id, label: item.title})
             }
            });
          }
          if (catPodcast.length == podcastPack.length - 1) {
            catPodcastDefault = [{value: "all", label: "همه موارد"}]
          }
          if (catAudioBook.length == audioBookPack.length - 1) {
            catAudioBookDefault = [{value: "all", label: "همه موارد"}]
          }
          if (catMusic.length == musicPack.length - 1) {
            catMusicDefault = [{value: "all", label: "همه موارد"}]
          }
          setAudioBookCatSelected([...catAudioBook]);
          setMusicCatSelected([...catMusic]);
          setAudioBookCategoriesDefault(catAudioBookDefault);
          setMusicCategoriesDefault(catMusicDefault);
          data.asset_file_id && setAssetCampaignAudio(data.asset_file_id);
          data.asset_square_id && setAssetCampaignCover(data.asset_square_id);
          data.asset_brand_id && setAssetBrandCover(data.asset_brand_id);
          setIsLoading(false)
        })
      });
    });
  }, [])

  const onSubmit = (data) => {

    let request = new FormData();
    let errors = {};
    if (!draftLoading) {
      if (title == null || title.length == 0) errors['title'] = ["Title is Required"];
      if (!brandName == null || brandName.length == 0) errors['brand_name'] = ["Brand Name is Required"];
      if (link == null || link.length == 0) errors['link'] = ["URL Link is Required"];
      if (assetBrandCover.length == 0) errors['brandCover'] = ["Brand Cover is Required"];
      if (assetCampaignCover.length == 0) errors['campaignCover'] = ["Campaign Cover is Required"];
      if (assetCampaignAudio.length == 0) errors['campaignAudio'] = ["Campaign Audio is Required"];
      if (new Date(endDate) < new Date()) {
        errors['end_date'] = ["End Date is Expired Time"];
      }
    }
    if (!isEmpty(errors)) {
      setRunLoading(false)
      setDraftLoading(false)
      setError(errors)
      return;
    }
    setSubmitLoading(true)
    // data['campaignCover'].length==0&&errors['campaignCover']=["Campaign Cover is Required"]
    request.append('brand_name', data['brand_name']);
    request.append('title', data['title']);
    request.append('times', data['times']);
    request.append('asset_square_id', assetCampaignCover);
    request.append('asset_brand_id', assetBrandCover);
    request.append('asset_file_id', assetCampaignAudio);
    request.append('link', data['link']);
    request.append('link_name', data['link_name']);
    request.append('content', content);
    request.append('start_date', startDate);
    request.append('end_date', endDate);
    request.append('podcastCat', podcastCatSelected);
    request.append('audioBookCat', audioBookCatSelected);
    request.append('musicCat', musicCatSelected);
    request.append('status', draftLoading ? "Draft" : new Date().getTime() < new Date(startDate).getTime() ? "Awaiting" : "Run");
    httpPost('api/ads/campain/update/' + campaignId, request).then((res) => {
      toast.success('Campaign was Updated.');
      setSubmitLoading(false)
      setRunLoading(false)
      setDraftLoading(false)
      // setTimeout(() => {
      //   navigate('/campaign/')
      // }, 1500)
    }).catch((r) => {
      setSubmitLoading(false)
      setRunLoading(false)
      setDraftLoading(false)
    })
  }
  useEffect(() => {
    if (startDate.length == 0) {
      setStartDate(new Date().yyyymmdd())
    }
  }, [startDate])

  useEffect(() => {
    if ((new Date(startDate) > new Date(endDate)) && (endDate != null && endDate.length != 0)) {
      setEndDate("")
      toast.error("Start Date can not be after of End Date")
    }
  }, [endDate, startDate])

  return (
    <div>
      {isLoading ? <div>
          <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/>
          <CSpinner color="dark" variant="grow"/><CSpinner color="secondary" variant="grow"/>
          <CSpinner color="dark" variant="grow"/>
        </div>
        :
        <CContainer>
          <ToastContainer/>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow className="align-items-start">
              <CCol className='my-1' sm={12}>
                <CRow className="align-items-start">
                  <CCol className='my-1' sm={12} lg={6} style={{paddingLeft: '0px'}}>
                    <CRow className="align-items-start">
                      <CCol className='my-1' sm={12}>
                        Campaign Name*:
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <CFormInput {...register('title')} style={{border: error.title != undefined && "2px solid red"}}
                                    value={title != null ? title : ""} onChange={(e) => {
                          setTitle(e.target.value)
                        }} placeholder='Name'/>
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <ul style={{color: "red", fontSize: "16px"}}>
                          {error.title != undefined &&
                            error.title.map((item, index) => (
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
                        Brand Name*:
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <CFormInput {...register('brand_name')}
                                    style={{border: error.brand_name != undefined && "2px solid red"}}
                                    value={brandName != null ? brandName : ""}
                                    onChange={(e) => {
                                      setBrandName(e.target.value)
                                    }} placeholder='Brand Name'/>
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <ul style={{color: "red", fontSize: "16px"}}>
                          {error.brand_name != undefined &&
                            error.brand_name.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                          }
                        </ul>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol sm={12}>
                    <CRow>
                      <CCol sm={6} style={{paddingLeft: "0px", position: "relative"}}>
                        <CCol sm={12} className="mt-4" style={{
                          border: error.brandCover != undefined ? '2px dashed red' : '1px dashed black',
                          padding: '0px'
                        }}>
                          <CFormLabel
                            htmlFor="brandCover" className='w-100 m-0 p-0'
                            style={{position: "relative"}}>
                            <CCol sm={12} className="bg-white" style={{height: "250px", position: "relative"}}>
                              <CRow className='text-secondary py-4 m-0'
                                    style={{cursor: "pointer", justifyContent: "center"}}>
                                <CCol sm={6} aria-hidden="true"
                                      style={{position: "relative", top: "17%", textAlign: "right"}}>
                                  {parse(brandCover)}
                                </CCol>
                                <CCol sm={6} style={{position: "relative", top: "19px", color: "black"}}>
                                  <h5>Brand Cover*</h5>
                                  <div style={{
                                    background: "blueviolet",
                                    color: "white",
                                    width: "60%",
                                    textAlign: "center",
                                    padding: "10px 25px",
                                    borderRight: "10px",
                                    opacity: brandCoverLoading ? "0.3" : "1"
                                  }}>
                                    {!brandCoverLoading ? "Upload Photo" :
                                      <>
                                        <div className="d-inline">Loading</div>
                                        <CSpinner size="sm" color="white"/>
                                      </>
                                    }
                                  </div>
                                  <div>
                                    Max: 400px*400px, 60KB
                                  </div>
                                </CCol>

                              </CRow>
                            </CCol>
                          </CFormLabel>
                        </CCol>
                        <CCol sm={12} className='my-2' style={{position: 'absolute', top: "24px"}}>
                          <CFormInput disabled={brandCoverLoading} {...register('brandCover')} style={{
                            height: '250px',
                            bottom: '18px',
                            backgroundColor: 'transparent',
                            opacity: '0'
                          }} onChange={(e) => {
                            uploadbrandCover(e)
                          }} type="file" id="brandCover"/>
                        </CCol>
                        <CCol className='my-1' sm={12}>
                          <ul style={{color: "red", fontSize: "16px"}}>
                            {error.brandCover != undefined &&
                              error.brandCover.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))
                            }
                          </ul>
                        </CCol>
                      </CCol>
                      <CCol className='my-3 p-0 mt-4' sm={6}>
                        <ReactQuill modules={Editormodules}
                                    style={{
                                      height: "100%",
                                      backgroundColor: 'white',
                                    }} {...register('Description')}
                                    value={content} onChange={(e) => {
                          setContent(e)
                        }}
                                    placeholder='Description'/>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className='my-1' style={{paddingLeft: 0}} sm={6}>
                    <CRow className="align-items-start">
                      <CCol className='my-1' sm={12}>
                        URL Link*:
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <CFormInput {...register('link')} style={{border: error.link != undefined && "2px solid red"}}
                                    value={link ? link : ""} onChange={(e) => {
                          setLink(e.target.value)
                        }}/> </CCol>
                      <CCol className='my-1' sm={12}>
                        <ul style={{color: "red", fontSize: "16px"}}>
                          {error.link != undefined &&
                            error.link.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                          }
                        </ul>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className='my-1' style={{paddingLeft: 0}} sm={6}>
                    <CRow className="align-items-start">
                      <CCol className='my-1' sm={12}>
                        CTA Name:
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <CFormInput {...register('link_name')} value={linkName ? linkName : ""} onChange={(e) => {
                          setLinkName(e.target.value)
                        }}/>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol sm={6} style={{paddingLeft: "0px", position: "relative"}}>
                    <CCol sm={12} className="mt-4" style={{
                      border: error.campaignCover != undefined ? '2px dashed red' : '1px dashed black',
                      padding: '0px'
                    }}>
                      <CFormLabel
                        htmlFor="campaignCover" className='w-100 m-0 p-0'
                        style={{position: "relative"}}>
                        <CCol sm={12} className="bg-white" style={{height: "250px", position: "relative"}}>
                          <CRow className='text-secondary py-4 m-0'
                                style={{cursor: "pointer", justifyContent: "center"}}>
                            <CCol sm={6} aria-hidden="true"
                                  style={{position: "relative", top: "17%", textAlign: "right"}}>
                              {parse(campaignCover)}
                            </CCol>
                            <CCol sm={6} style={{position: "relative", top: "19px", color: "black"}}>
                              <h5>Campaign Cover*</h5>
                              <div style={{
                                background: "blueviolet",
                                color: "white",
                                width: "60%",
                                textAlign: "center",
                                padding: "10px 25px",
                                borderRight: "10px",
                                opacity: campaignCoverLoading ? "0.3" : "1"
                              }}>
                                {!campaignCoverLoading ? "Upload Photo" :
                                  <>
                                    <div className="d-inline">Loading</div>
                                    <CSpinner size="sm" color="white"/>
                                  </>
                                }
                              </div>
                              <div>
                                Max: 800px*800px, 120KB
                              </div>
                            </CCol>

                          </CRow>
                        </CCol>
                      </CFormLabel>
                    </CCol>
                    <CCol sm={12} className='my-2' style={{position: 'absolute', top: "24px"}}>
                      <CFormInput {...register('campaignCover')} style={{
                        height: '250px',
                        bottom: '18px',
                        backgroundColor: 'transparent',
                        opacity: '0'
                      }} onChange={(e) => {
                        uploadCampaignCover(e)
                      }} disabled={campaignCoverLoading} type="file" id="campaignCover"/>
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <ul style={{color: "red", fontSize: "16px"}}>
                        {error.campaignCover != undefined &&
                          error.campaignCover.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        }
                      </ul>
                    </CCol>
                  </CCol>
                  <CCol sm={6} style={{paddingLeft: "0px", position: "relative"}}>
                    <CCol sm={12} className="mt-4" style={{
                      border: error.campaignAudio != undefined ? '2px dashed red' : '1px dashed black',
                      padding: '0px'
                    }}>
                      <CFormLabel
                        htmlFor="campaignAudio" className='w-100 m-0 p-0'
                        style={{position: "relative"}}>
                        <CCol sm={12} className="bg-white" style={{height: "250px", position: "relative"}}>
                          <CRow className='text-secondary py-4 m-0'
                                style={{cursor: "pointer", justifyContent: "center"}}>
                            <CCol sm={6} aria-hidden="true"
                                  style={{position: "relative", top: "23px", textAlign: "right"}}>
                              <svg width="100" height="100" viewBox="0 0 90 89" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M45 47.9766C49.7194 47.9766 53.5176 44.2219 53.5176 39.6328V20.1641C53.5176 15.575 49.7194 11.8203 45 11.8203C40.2806 11.8203 36.4824 15.575 36.4824 20.1641V39.6328C36.4824 44.2219 40.2806 47.9766 45 47.9766Z"
                                  fill="black" fill-opacity="0.15"/>
                                <path
                                  d="M73.6816 39.459C73.6816 39.0766 73.3688 38.7637 72.9863 38.7637H67.7715C67.3891 38.7637 67.0762 39.0766 67.0762 39.459C67.0762 51.653 57.194 61.5352 45 61.5352C32.806 61.5352 22.9238 51.653 22.9238 39.459C22.9238 39.0766 22.6109 38.7637 22.2285 38.7637H17.0137C16.6312 38.7637 16.3184 39.0766 16.3184 39.459C16.3184 54.1214 27.3217 66.2198 41.5234 67.932V76.832H28.8948C27.7041 76.832 26.748 78.0749 26.748 79.6133V82.7422C26.748 83.1246 26.9914 83.4375 27.2869 83.4375H62.7131C63.0086 83.4375 63.252 83.1246 63.252 82.7422V79.6133C63.252 78.0749 62.2959 76.832 61.1052 76.832H48.1289V67.9755C62.4958 66.411 73.6816 54.2431 73.6816 39.459Z"
                                  fill="#D9D9D9"/>
                                <path
                                  d="M45 54.2344C53.1612 54.2344 59.7754 47.6984 59.7754 39.6328V20.1641C59.7754 12.0984 53.1612 5.5625 45 5.5625C36.8388 5.5625 30.2246 12.0984 30.2246 20.1641V39.6328C30.2246 47.6984 36.8388 54.2344 45 54.2344ZM36.4824 20.1641C36.4824 15.575 40.2806 11.8203 45 11.8203C49.7194 11.8203 53.5176 15.575 53.5176 20.1641V39.6328C53.5176 44.2219 49.7194 47.9766 45 47.9766C40.2806 47.9766 36.4824 44.2219 36.4824 39.6328V20.1641Z"
                                  fill="#D9D9D9"/>
                              </svg>
                            </CCol>
                            <CCol sm={6} style={{position: "relative", top: "19px", color: "black"}}>
                              <h5>Campaign Audio*</h5>
                              <div style={{
                                background: "blueviolet",
                                color: "white",
                                width: "60%",
                                textAlign: "center",
                                padding: "10px 25px",
                                borderRight: "10px",
                                opacity: campaignAudioLoading ? "0.3" : "1"
                              }}>
                                {!campaignAudioLoading ? "Upload Audio" :
                                  <>
                                    <div className="d-inline">Loading</div>
                                    <CSpinner size="sm" color="white"/>
                                  </>
                                }
                              </div>
                              <div>
                                Maximum Duration: 1 Minute.
                                <br/>
                                Type: mp3
                              </div>
                            </CCol>
                            <CCol sm={12} className="my-3" style={{position: "relative", zIndex: "100"}}>
                              {parse(campaignAudio)}
                            </CCol>
                          </CRow>
                        </CCol>
                      </CFormLabel>
                    </CCol>
                    <CCol sm={12} className='my-2' style={{position: 'absolute', top: "24px"}}>
                      <CFormInput {...register('campaignAudio')} style={{
                        height: '250px',
                        bottom: '18px',
                        backgroundColor: 'transparent',
                        opacity: '0'
                      }} onChange={(e) => {
                        uploadCampaignAudio(e)
                      }} disabled={campaignAudioLoading} type="file" id="campaignAudio"/>
                    </CCol>
                    <CCol className='my-1' sm={12}>
                      <ul style={{color: "red", fontSize: "16px"}}>
                        {error.campaignAudio != undefined &&
                          error.campaignAudio.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        }
                      </ul>
                    </CCol>
                  </CCol>
                </CRow>
              </CCol>
              <CCol className='my-1' style={{paddingLeft: "0"}} sm={12} lg={6}>
                <CRow className="align-items-start">
                  <CCol className='my-1' sm={12}>
                    Count:
                  </CCol>
                  <CCol className='my-1' sm={12}>
                    <CFormInput {...register('times')} value={times != null ? times : ""} onChange={(e) => {
                      setTimes(e.target.value)
                    }} type='number'/>
                  </CCol>
                </CRow>
              </CCol>
              <CCol className="my-2 p-0" sm={12}>
                <h3>Start And Stop</h3>
              </CCol>
              <CCol sm={12} style={{background: "white", borderRadius: "8px", border: "1px solid #aaa"}}>
                <CRow>
                  <CCol className='my-1' sm={6}>
                    <CRow className="align-items-start">
                      <CCol className='my-1' sm={12}>
                        <input style={{margin: "0px 5px"}} value='now' name="start" checked={isStart == 'now'}
                               onChange={(e) => {
                                 setIsStart(e.target.value);
                                 setStartDate(new Date().yyyymmdd());
                               }
                               } type="radio"/>
                        Start From Now
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <input style={{margin: "0px 5px"}} value='select' checked={isStart == 'select'}
                               onChange={(e) => {
                                 setIsStart(e.target.value)
                               }} name="start" type="radio"/>
                        Select Start Date
                      </CCol>
                      <CCol className='my-1' sm={6} style={{width: "100%"}}>
                        <DatePicker calendar={persian} disabled={isStart != 'select'}
                                    value={startDate && moment(startDate).locale('fa').format('YYYY/MM/DD')}
                                    style={{background: isStart != 'select' ? "rgb(243 238 238)" : "white"}}
                                    locale={persian_fa} onChange={(e) => {
                          if (new Date() > new Date(e.unix * 1000)) {
                            setStartDate("");
                            toast.error("Start Date is ahead of Current Time")
                          } else {
                            setStartDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                          }
                        }}/>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol className='my-1' sm={6}>
                    <CRow className="align-items-start">
                      <CCol className='my-1' sm={12}>
                        <input style={{margin: "0px 5px"}} value='no' name="end" checked={isEnd == 'no'}
                               onChange={(e) => {
                                 setIsEnd(e.target.value);
                                 setEndDate("");
                               }
                               } type="radio"/>
                        No End Date
                      </CCol>
                      <CCol className='my-1' sm={12}>
                        <input style={{margin: "0px 5px"}} value='select' checked={isEnd == 'select'} onChange={(e) => {
                          setIsEnd(e.target.value)
                        }} name="end" type="radio"/>
                        Select End Date
                      </CCol>
                      <CCol className='my-1' sm={6} style={{width: "100%"}}>
                        <DatePicker calendar={persian} disabled={isEnd != 'select'}
                                    value={endDate ? moment(endDate).locale('fa').format('YYYY/MM/DD') : ""}
                                    style={{
                                      background: isEnd != 'select' ? "rgb(243 238 238)" : "white"
                                      , border: error.end_date != undefined && "2px solid red"
                                    }}
                                    locale={persian_fa} onChange={(e) => {
                          setEndDate(e != null ? new Date(e.unix * 1000).yyyymmdd() : '');
                        }}
                        />
                        <CCol>
                          <ul style={{color: "red", fontSize: "16px"}}>
                            {error.end_date != undefined &&
                              error.end_date.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))
                            }
                          </ul>
                        </CCol>
                      </CCol>

                    </CRow>
                  </CCol>
                </CRow>
              </CCol>
              {/*categories*/}
              <CCol className="mt-2 p-0" sm={12}>
                <h3 className="my-2" style={{fontWeight: 500}}>Categories</h3>
              </CCol>
              <CCol className="my-1" sm={12}>
                <CRow>
                  <CCol sm={12} style={{paddingLeft: "0"}} lg={4}>
                    <CRow>
                      <CCol sm={12}><h4>Podcast</h4></CCol>
                      <CCol sm={12}> <Select value={podcastCategoriesDefault} isMulti options={podcastCategories}
                                             onChange={(e) => {
                                               let val = [];
                                               let valchoosed = [];
                                               e.map((item, index) => {
                                                 if (item['value'] == "all" || podcastCategories.length - 1 == e.length) {
                                                   val = []
                                                   podcastCategories.map((items, index) => {
                                                     val.push(items['value'])
                                                   });
                                                   valchoosed = [{value: "all", label: "همه موارد"}]
                                                   return;
                                                 }
                                                 val.push(item['value'])
                                                 valchoosed.push({value: item['value'], label: item.label})
                                               });
                                               setPodcastCatSelected(val.filter(item => item != "all"))
                                               setPodcastCategoriesDefault(valchoosed)
                                             }}> </Select></CCol>
                    </CRow>

                  </CCol>
                  <CCol sm={12} style={{paddingLeft: "0", paddingRight: "0"}} lg={4}>
                    <CRow>
                      <CCol sm={12}><h4>Audio Bookt</h4></CCol>
                      <CCol sm={12}> <Select value={audioBookCategoriesDefault} isMulti options={audioBookCategories}
                                             onChange={(e) => {
                                               let val = [];
                                               let valchoosed = [];
                                               e.map((item, index) => {
                                                 if (item['value'] == "all" || audioBookCategories.length - 1 == e.length) {
                                                   val = []
                                                   audioBookCategories.map((items, index) => {
                                                     val.push(items['value'])
                                                   });
                                                   valchoosed = [{value: "all", label: "همه موارد"}]
                                                   return;
                                                 }
                                                 val.push(item['value'])
                                                 valchoosed.push({value: item['value'], label: item.label})
                                               });
                                               setAudioBookCatSelected(val.filter(item => item != "all"))
                                               setAudioBookCategoriesDefault(valchoosed)
                                             }}> </Select></CCol>
                    </CRow>

                  </CCol>
                  <CCol sm={12} style={{paddingRight: "0"}} lg={4}>
                    <CRow>
                      <CCol sm={12}><h4>Music</h4></CCol>
                      <CCol sm={12}> <Select value={musicCategoriesDefault} isMulti options={musicCategories}
                                             onChange={(e) => {
                                               let val = [];
                                               let valchoosed = [];
                                               e.map((item, index) => {
                                                 if (item['value'] == "all" || musicCategories.length - 1 == e.length) {
                                                   val = []
                                                   musicCategories.map((items, index) => {
                                                     val.push(items['value'])
                                                   });
                                                   valchoosed = [{value: "all", label: "همه موارد"}]
                                                   return;
                                                 }
                                                 val.push(item['value'])
                                                 valchoosed.push({value: item['value'], label: item.label})
                                               });
                                               setMusicCatSelected(val.filter(item => item != "all"))
                                               setMusicCategoriesDefault(valchoosed)
                                             }}> </Select></CCol>
                    </CRow>

                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={12} className="my-4">
                <CRow className='d-flex justify-content-end'>
                  <CCol sm={2}>
                    <NavLink style={{textDecoration: "none", color: "white", display: "block"}} to="/campaign">
                      <CButton title={'Close'} name='dataTable' className='text-white px-4 w-100'
                               color="danger"
                               disabled={submitLoading}
                      >
                        Close
                      </CButton>
                    </NavLink>
                  </CCol>
                  {status == "Draft" &&
                    <CCol sm={2}>
                      <CButton type='submit' title={'Save'} onClick={(e) => {
                        setDraftLoading(true)
                      }} name='dataTable' className='text-white px-4 w-100'
                               color="warning"
                               disabled={submitLoading}>             {!draftLoading ? 'Draft' :
                        <CSpinner size='sm' color="light"/>}</CButton>
                    </CCol>
                  }
                  <CCol sm={2}>
                    <CButton type='submit' title={'Save'} onClick={(e) => {
                      setRunLoading(true)
                    }} name='dataTable' className='text-white px-4 w-100'
                             color="success"
                             disabled={submitLoading}>             {!runLoading ? status == "Run" || status == "Awaitnig" ? 'Save' : "Save And Run" :
                      <CSpinner size='sm' color="light"/>}</CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CContainer>
      }
    </div>


  )
}

export default campaignsCreate
