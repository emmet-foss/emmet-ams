import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Calendar, Col, Row, Badge, Spin } from 'antd';
import ReactGA from 'react-ga';
import moment from 'moment';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

class CalendarForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      attendanceDates: [],
      loading: false,
    };
	}

  componentDidMount() {
    this.getAttendanceDates()
      .then(res => this.setState({ attendanceDates: res.result, loading: false }))
      .catch(err => console.log(err));
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getAttendanceDates()
        .then(res => this.setState({ attendanceDates: res.result, loading: false }))
        .catch(err => console.log(err));
    }
  }

  getAttendanceDates = async () => {
    this.setState({ loading: true })
    const groupId = this.props.location.pathname.split('/')[2];
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');
    const response = await emmetAPI.getUrl(`/ams/church_groups/${groupId}/attendance_dates?startDate=${startDate}&endDate=${endDate}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  goToAttendanceList = async (attendanceDate) => {
    ReactGA.event({
      category: 'attendance calendar',
      action: 'go to attendance date'
    });
    const groupId = this.props.location.pathname.split('/')[2];
    this.props.history.push(`/church_groups/${groupId}/attendance_list?attendanceDate=${attendanceDate.format("YYYY-MM-DD")}`)
  };

  dateCellRender = (value) => {
    const { attendanceDates } = this.state;
    if (attendanceDates.includes(value.format("YYYY-MM-DD"))) {
        return <Badge status={'warning'} />;
    }
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          </div>
        </div>
      )
    }

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row key="1" type="flex" justify="center">
            <Col key="2" xs={24} sm={24} md={24} lg={12}>
              <h3>On which date would you like to submit an attendance?</h3>
              <Calendar
                key="4" 
                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
                fullscreen={false}
                onSelect={this.goToAttendanceList}
                dateCellRender={this.dateCellRender}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(CalendarForm);
