import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import {
  Avatar,
  Button,
  Col,
  List,
  message,
  Row,
  Statistic,
} from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

class AttendanceForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      loading: false,
    };
	}

  handleConfirmAttendance = async () => {
    this.setState({ loading: true })
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const attendanceDate = query.attendanceDate;
    const memberIds = this.props.checkedMembers.map(item => item.memberId)
    emmetAPI.fetchUrl(`/ams/attendance/${localeId}?attendanceDate=${attendanceDate}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberIds: memberIds
      }),
    })
    .then(res => {
      this.setState({ loading: false })
      if (res.status === 200) {
        message.success('Attendance successfully submitted.');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      message.error('Error submitting attendance.');
    });
  };

  render() {
    const { checkedMembers } = this.props;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              {(checkedMembers && checkedMembers.length === 0) ?
                <Statistic value="No members available in this locale." />
              :
                <div>
                  <Statistic value="Please select the members who were present:" />
                  <List
                    itemLayout="horizontal"
                    bordered
                    size="large"
                    dataSource={checkedMembers}
                    renderItem={item => (
                      <List.Item
                        key={item.memberId}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={item.memberName}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              }
              <Button
                block
                type="primary"
                loading={this.state.loading}
                onClick={this.handleConfirmAttendance}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(AttendanceForm);
