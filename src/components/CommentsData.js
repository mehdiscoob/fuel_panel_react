import PropTypes from 'prop-types'
import axios from 'axios'
import React from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCode, cilMediaPlay } from '@coreui/icons'

const CommentsData = async (data)=>{
  const datas=await axios.get('api/mss/comments?page=2').then((response) => {
    setComments(response.data.data);
    return datas;
  });
}




export default React.memo(CommentsData)
