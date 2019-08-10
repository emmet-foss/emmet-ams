import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Col, Row, Table, Spin } from 'antd';
import * as qs from 'query-string';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Report.css';

const columns = [
  {
    title: 'Date',
    dataIndex: '_id',
    key: '_id',
    render: _id =>
      <NavLink
        style={{ padding: 10 }}
        to={`/locale_church/${_id.localeChurchId}/attendance_details?gathering=${_id.gathering}&attendanceDate=${_id.attendanceDate.substr(0,10)}`}
      >
        {_id.attendanceDate.substr(0,10)}
      </NavLink>
  },
  {
    title: 'Event/Activity',
    dataIndex: '_id.gathering',
    key: '_id.gathering',
    render: gathering => <span>{gathering}</span>,
  },
  {
    title: 'No. of Attendees',
    dataIndex: '_id',
    key: '_id.count',
    render: (_id) =>
      <NavLink
        style={{ padding: 10 }}
        to={`/locale_church/${_id.localeChurchId}/attendance_details?gathering=${_id.gathering}&attendanceDate=${_id.attendanceDate.substr(0,10)}`}
      >
        {_id.count}
      </NavLink>
  },
];

class MonthlyReport extends Component {
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
    const response = await emmetAPI.getUrl(`/ams/attendance/${localeId}/monthly?period=${query.period}`)
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
    const { result, period, localeInfo, loadingLocaleInfo, loadingAttendance } = this.state;
    const loading = (loadingLocaleInfo || loadingAttendance );

    let modResult = [];
    if (result.length > 0) {
      let i = 0;
      result.forEach(item => {
        modResult.push({ ...item, key: i++ });
      });
    }

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
                <h2>{`No ${localeInfo.name} attendance available for ${period}.`}</h2>
              :
                <div>
                  <h3>{`Here's the attendance for ${localeInfo.name} on ${period}:`}</h3>
                  <Table pagination={false} columns={columns} dataSource={modResult} />
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

export default MonthlyReport;
