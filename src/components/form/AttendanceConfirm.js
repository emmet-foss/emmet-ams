import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import { Avatar, Button, Col, List, message, Row } from 'antd';
import ReactGA from 'react-ga';

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

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  handleSubmit = async () => {
    ReactGA.event({
      category: 'Attendance',
      action: 'submit attendance'
    });

    this.setState({ loading: true })
    const groupId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gathering } = query;
    const memberIds = this.props.checkedMembers.map(item => item.memberId)
    emmetAPI.fetchUrl(`/ams/attendance/${groupId}?attendanceDate=${attendanceDate}&gathering=${gathering}`, {
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
        this.props.clearMembers();
        message.success('Attendance successfully submitted.');
        this.props.history.push(`/church_groups/${groupId}/attendance_list?attendanceDate=${attendanceDate}`)
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
                <h3>No members were selected. Click submit to remove the attendance recorded on this date.</h3>
              :
                <div>
                  <h4>Please confirm the following attendance:</h4>
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
                onClick={this.handleSubmit}
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
