import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Col, Icon, Row, Spin, Table } from 'antd';
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
    render: _id =>
      <NavLink
        style={{ padding: 10 }}
        to={`/locale_church/${_id.localeChurchId}/update_attendance?gathering=${_id.gathering}&attendanceDate=${_id.attendanceDate.substr(0,10)}`}
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
    const response = await emmetAPI.getUrl(`/ams/attendance/aggregate?localeId=${localeId}&attendanceDate=${query.attendanceDate}`)
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
                <div>
                  <h3>{`Sorry, but there's no attendance available for ${localeInfo.name} on ${attendanceDate}.`}</h3>
                  <div>
                    <span>Would you like to submit an attendance?</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/attendance?attendanceDate=${attendanceDate}`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/calendar_form`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="cross"/>No
                      </Button>
                    </NavLink>
                  </div>
                </div>
              :
                <div>
                  <h3>Here's the attendance for {`${localeInfo.name} on ${attendanceDate}:`}</h3>
                  <Table pagination={false} columns={columns} dataSource={modResult} />

                  <span>Would you like to submit another?</span>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/attendance?attendanceDate=${attendanceDate}`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/calendar_form`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="cross"/>No
                      </Button>
                    </NavLink>
                  </div>
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
