import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button, Col, Icon, Row, Spin, Statistic, Table,
} from 'antd';
import * as qs from 'query-string';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './List.css';

const columns = [
  {
    title: 'Date',
    dataIndex: '_id',
    key: '_id',
    render: _id => <span>{_id.attendanceDate.substr(0,10)}</span>,
  },
  {
    title: 'Event/Activity',
    dataIndex: '_id',
    key: '_id',
    render: _id => <span>{_id.gathering}</span>,
  },
  {
    title: 'No. of Attendees',
    dataIndex: 'count',
    key: 'count',
  },
];

class AttendanceList extends Component {
  state = {
    result: [],
    period: "",
    localeInfo: "",
    loadingAttendance: false,
    loadingLocaleInfo: false,
  };

  componentDidMount() {
    this.getMonthlyAttendance()
      .then(res => {
        this.setState({ result: res.result, loadingAttendance: false })
      })
      .catch(err => console.log(err));  

    this.getLocaleInfo()
      .then(res => {
        this.setState({ localeInfo: res.locale, loadingLocaleInfo: false })
      })
      .catch(err => console.log(err));  

    const query = qs.parse(this.props.location.search);
    this.setState( { period: query.period } );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMonthlyAttendance()
        .then(res => {
          this.setState({ result: res.result, loadingAttendance: false })
        })
        .catch(err => console.log(err));

      this.getLocaleInfo()
        .then(res => {
          this.setState({ localeInfo: res.locale, loadingLocaleInfo: false })
        })
        .catch(err => console.log(err));  
  
      const query = qs.parse(this.props.location.search);
      this.setState( { period: query.period } );
    }
  }

  getMonthlyAttendance = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    this.setState({ loadingAttendance: true })
    const response = await emmetAPI.getUrl(`/ams/attendance/by_date?localeId=${localeId}&attendanceDate=${query.attendanceDate}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getLocaleInfo = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    this.setState({ loadingLocaleInfo: true });
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  handleLocaleSelect = async (localeValue) => {
    ReactGA.event({
      category: 'Home',
      action: 'locale select'
    });
    this.setState({
      selectedLocale: localeValue
    });
  };

  render() {
    const query = qs.parse(this.props.location.search);
    const { attendanceDate } = query;
    const { result, localeInfo, loadingLocaleInfo, loadingAttendance } = this.state;
    const loading = (loadingLocaleInfo || loadingAttendance );

    return (
      <div className="wrap">
        <div className="extraContent">
          {loading ?
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          :
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
              {(result && result.length === 0) ?
                <div>
                  <Statistic value={`No ${localeInfo.name} attendance available for ${attendanceDate}.`} />
                  <Statistic value={"Would you like to submit an attendance?"} suffix={
                    <span>
                      <NavLink to={`/locale_church/${localeInfo._id}/attendance?attendanceDate=${attendanceDate}`}>
                        <Button type="primary" size="small">
                          <Icon type="check"/>Yes
                        </Button>
                      </NavLink>
                      <NavLink to={`/locale_church/${localeInfo._id}/calendar_form`}>
                        <Button type="primary" size="small">
                          <Icon type="cross"/>No
                        </Button>
                      </NavLink>
                    </span>
                  }/>
                </div>
              :
                <div>
                  <Statistic value={"Here's the attendance for"} />
                  <Statistic value={`${localeInfo.name}, ${attendanceDate}:`} />
                  <Table pagination={false} columns={columns} dataSource={result} />

                  <Statistic value={"Would you like to submit another?"} suffix={
                    <span>
                      <NavLink to={`/locale_church/${localeInfo._id}/attendance?attendanceDate=${attendanceDate}`}>
                        <Button type="primary" size="small">
                          <Icon type="check"/>Yes
                        </Button>
                      </NavLink>
                      <NavLink to={`/locale_church/${localeInfo._id}/calendar_form`}>
                        <Button type="primary" size="small">
                          <Icon type="cross"/>No
                        </Button>
                      </NavLink>
                    </span>
                  } />
                </div>
              }
              </Col>
            </Row>
          }
        </div>
      </div>
    );
  }
}

export default AttendanceList;
