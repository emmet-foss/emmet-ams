import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import { Avatar, Button, Col, Checkbox, Icon, List, Row, Spin } from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';
import * as constants from '../../helpers/constants';

import 'antd/dist/antd.css';
import './CreateForm.css';

class UpdateAttendanceForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    mode: PropTypes.string,
  };

  constructor(props) {
		super(props);
		this.state = {
      members: [],
      membersPresent: [],
      checkedMembers: [],
      churchGroupInfo: {},
      loadingMembersPresent: false,
      loadingMembers: false,
      loadingChurchGroupInfo: false,
    };
	}

  setMembers = () => {
    this.state.membersPresent.forEach(member => {
      const e = {
        target: {
          memberId: member._id,
          memberName: member.name,
          checked: true,
        }
      };
      this.props.setMember(e);
    });
  }

  componentDidMount() {
    this.getAttendance()
      .then(res => {
        this.setState({ membersPresent: res.members, loadingMembersPresent: false });
        this.setMembers();
      })
      .catch(err => console.log(err));

    this.getChurchGroupInfo()
      .then(res => {
        this.setState({ churchGroupInfo: res.churchGroup, loadingChurchGroupInfo: false })
      })
      .catch(err => console.log(err));  

    this.getMembers()
      .then(res => this.setState({ members: res.members, loadingMembers: false }))
      .catch(err => console.log(err));
    this.props.clearMembers();
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getAttendance()
        .then(res => {
          this.setState({ membersPresent: res.members, loadingMembersPresent: false });
          this.setMembers();
        })
        .catch(err => console.log(err));
      this.getMembers()
        .then(res => this.setState({ members: res.members, loadingMembers: false }))
        .catch(err => console.log(err));
      }
  }

  getAttendance = async () => {
    this.setState({ loadingMembersPresent: true });

    const churchGroupId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gathering } = query;
    const response = await emmetAPI.getUrl(`/ams/attendance?churchGroupId=${churchGroupId}&attendanceDate=${attendanceDate}&gathering=${gathering}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getMembers = async () => {
    this.setState({ loadingMembers: true });

    const churchGroupId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/church_groups/${churchGroupId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getChurchGroupInfo = async () => {
    const churchGroupId = this.props.location.pathname.split('/')[2];
    this.setState({ loadingChurchGroupInfo: true });
    const response = await emmetAPI.getUrl(`/ams/church_groups/${churchGroupId}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleUpdateAttendance = async () => {
    ReactGA.event({
      category: 'Attendance',
      action: 'confirm attendance'
    });
    const churchGroupId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gathering } = query
    this.props.history.push(`/church_groups/${churchGroupId}/confirm_attendance?attendanceDate=${attendanceDate}&gathering=${gathering}`)
  };
  
  render() {
    const { members, churchGroupInfo, loadingChurchGroupInfo, loadingMembers, loadingMembersPresent, membersPresent } = this.state;
    const { mode } = this.props;
    const memberIds = membersPresent.map((member) => {
      return member._id;
    })
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gathering } = query

    const loading = (loadingChurchGroupInfo || loadingMembers || loadingMembersPresent);
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
      );
    }
    return (
      <div className="wrap">
        <div className="extraContent">
        {(members && members.length === 0) ?
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
                <h2>No members present in the specified date and gathering.</h2>
            </Col>
          </Row>
        :
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <div>
                <h4>{`These were the members of ${churchGroupInfo.name} who were present during ${constants.gatherings[gathering]} on ${attendanceDate}:`}</h4>
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
                      {mode !== 'read-only' &&
                        <Checkbox
                          memberId={item._id}
                          memberName={item.name}
                          onChange={this.props.setMember}
                          defaultChecked={memberIds.indexOf(item._id) >= 0}
                        />
                      }
                    </List.Item>
                  )}
                />
                {mode !== 'read-only' &&
                  <Button
                    block
                    type="primary"
                    onClick={this.handleUpdateAttendance}
                  >
                    Confirm<Icon type="right"/>
                  </Button>
                }
              </div>
            </Col>
          </Row>
        }
        </div>
      </div>
    );
  }
}

// Set default props
UpdateAttendanceForm.defaultProps = {
  mode: ''
};

export default withRouter(UpdateAttendanceForm);
