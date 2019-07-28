import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import {
  Avatar,
  Button,
  Col,
  Checkbox,
  List,
  message,
  Row,
  Statistic,
} from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

class ReportForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    members: [],
    checkedMembers: [],
    name: '',
    location: '',
    responseToPost: '',
    collapsed: false,
  };

  componentDidMount() {
    this.getMembers()
      .then(res => this.setState({ members: res.members }))
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMembers()
        .then(res => this.setState({ members: res.members }))
        .catch(err => console.log(err));
    }
  }

  getMembers = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/report/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  goToReportsPage = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const attendanceDate = query.attendanceDate;
    emmetAPI.fetchUrl(`/ams/reports/${localeId}?attendanceDate=${attendanceDate}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberIds: this.state.checkedMembers
      }),
    })
    .then(res => {
      console.log('res', res)
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

  setMember = (e) => {
    const { checkedMembers } = this.state;
    const { memberId, checked } = e.target;

    if (checked) {
      checkedMembers.push(memberId);
      this.setState({ checkedMembers });
    } else {
      var filtered = checkedMembers.filter(function(value, index, arr){
        return value !== memberId;
      });
      this.setState({ checkedMembers: filtered });
    }
  }

  render() {
    const { members } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              {(members && members.length === 0) ?
                <Statistic value="No members available in this locale." />
              :
                <div>
                  <Statistic value="Please select the members who were present:" />
                  <List
                    itemLayout="horizontal"
                    bordered
                    size="large"
                    dataSource={members}
                    renderItem={item => (
                      <List.Item
                        key={item._id}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={item.name}
                        />
                        <Checkbox memberId={item._id} onChange={this.setMember}/>
                      </List.Item>
                    )}
                  />
                </div>
              }
              <Button
                block
                type="primary"
                onClick={this.goToReportsPage}
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

export default withRouter(ReportForm);
