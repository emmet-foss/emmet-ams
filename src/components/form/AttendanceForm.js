import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
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

  state = {
    members: [],
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
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleConfirmAttendance = async () => {
    const guest_id = localStorage.getItem('guest_id');
    emmetAPI.fetchUrl(`/ams/checkout/${guest_id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "guest"
      }),
    })
    .then(res => {
      console.log('res', res)
      if (res.status === 200) {
        message.success('Items successfully checked out. Please wait for your orders to be handed over to you on your visit.');
        this.setState({ members: [] })
        console.log('res', res)
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error checking out.');
    });
  };

  render() {
    const { members } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row>
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
                        {item.name}
                      </List.Item>
                    )}
                  />
                  <div>
                    <Button
                      type="primary"
                      onClick={this.handleConfirmAttendance}
                    >
                      Confirm checkout
                    </Button>
                  </div>
                </div>
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(AttendanceForm);
