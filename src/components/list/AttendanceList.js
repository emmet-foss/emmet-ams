import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Col, Icon, Row, Spin, Table } from 'antd';
import * as qs from 'query-string';

import emmetAPI from '../../emmetAPI';
import * as constants from '../../helpers/constants';

import 'antd/dist/antd.css';
import './List.css';

const columns = [
  {
    title: 'Date',
    dataIndex: '_id',
    key: '_id',
    render: _id =>
      <NavLink
        to={`/church_groups/${_id.churchGroupId}/update_attendance?gathering=${_id.gathering}&attendanceDate=${_id.attendanceDate.substr(0,10)}`}
      >
        {_id.attendanceDate.substr(0,10)}
      </NavLink>
  },
  {
    title: 'Activity',
    dataIndex: '_id.gathering',
    key: '_id.gathering',
    render: gathering => <span>{constants.gatherings[gathering]}</span>,
  },
  {
    title: 'Count',
    dataIndex: '_id',
    key: '_id.count',
    render: _id =>
      <NavLink
        to={`/church_groups/${_id.churchGroupId}/update_attendance?gathering=${_id.gathering}&attendanceDate=${_id.attendanceDate.substr(0,10)}`}
      >
        {_id.count}
      </NavLink>
  },
];

class AttendanceList extends Component {
  state = {
    result: [],
    period: "",
    churchGroupInfo: "",
    loadingAttendance: false,
    loadingGroupInfo: false,
  };

  componentDidMount() {
    this.getMonthlyAttendance()
      .then(res => {
        this.setState({ result: res.result, loadingAttendance: false })
      })
      .catch(err => console.log(err));  

    this.getChurchGroupInfo()
      .then(res => {
        this.setState({ churchGroupInfo: res.data, loadingGroupInfo: false })
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

      this.getChurchGroupInfo()
        .then(res => {
          this.setState({ churchGroupInfo: res.data, loadingGroupInfo: false })
        })
        .catch(err => console.log(err));  
  
      const query = qs.parse(this.props.location.search);
      this.setState( { period: query.period } );
    }
  }

  getMonthlyAttendance = async () => {
    const churchGroupId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    this.setState({ loadingAttendance: true })
    const response = await emmetAPI.getUrl(`/ams/attendance/aggregate?churchGroupId=${churchGroupId}&attendanceDate=${query.attendanceDate}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getChurchGroupInfo = async () => {
    const churchGroupId = this.props.location.pathname.split('/')[2];
    this.setState({ loadingGroupInfo: true });
    const response = await emmetAPI.getUrl(`/ams/church_groups/${churchGroupId}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const query = qs.parse(this.props.location.search);
    const { attendanceDate } = query;
    const { result, churchGroupInfo, loadingGroupInfo, loadingAttendance } = this.state;
    const loading = (loadingGroupInfo || loadingAttendance );

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
                  <h3>{`Sorry, but there's no attendance available for ${churchGroupInfo.name} on ${attendanceDate}.`}</h3>
                  <div>
                    <span>Would you like to submit an attendance?</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/church_groups/${churchGroupInfo._id}/attendance?attendanceDate=${attendanceDate}`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/church_groups/${churchGroupInfo._id}/calendar_form`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="cross"/>No
                      </Button>
                    </NavLink>
                  </div>
                </div>
              :
                <div>
                  <h3>Here's the attendance for {`${churchGroupInfo.name} on ${attendanceDate}:`}</h3>
                  <Table pagination={false} columns={columns} dataSource={modResult} />

                  <span>Would you like to submit another?</span>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/church_groups/${churchGroupInfo._id}/attendance?attendanceDate=${attendanceDate}`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/church_groups/${churchGroupInfo._id}/calendar_form`}
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
