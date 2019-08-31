import React, { Component } from 'react';
import {
  Button, Col, Icon,
  Select, Row,
} from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;

class Home extends Component {
  state = {
    stores: [],
    availableDates: [],
  };

  componentDidMount() {
    this.getGroups()
      .then(res => {
        this.setState({ churchGroups: res.churchGroups })
        let storedGroupId = localStorage.getItem('churchGroupId');
        if (storedGroupId) {
          this.setState({ selectedGroup: storedGroupId })
        }
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getGroups()
      .then(res => {
        this.setState({ churchGroups: res.churchGroups })
        let storedGroupId = localStorage.getItem('churchGroupId');
        if (storedGroupId) {
          this.setState({ selectedGroup: storedGroupId })
        }
      })
      .catch(err => console.log(err));
    }
  }

  getGroups = async () => {
    const response = await emmetAPI.getUrl('/ams/church_groups?ministryName=music%20ministry')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleGroupSelect = async (value) => {
    ReactGA.event({
      category: 'Home',
      action: 'group select'
    });
    this.setState({ selectedGroup: value });
  };

  handleOnClick = () => {
    const { selectedGroup } = this.state;
    localStorage.setItem('churchGroupId', selectedGroup);
    this.props.history.push(`/church_groups/${selectedGroup}/calendar_form`);
  }

  render() {
    const { churchGroups, selectedGroup } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <div>Welcome to Choir AMS!</div>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <h3>From what locale choir are you?</h3>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Please select a locale choir"
                dropdownMatchSelectWidth={false}
                onChange={this.handleGroupSelect}
                value={selectedGroup}
              >
                {churchGroups && churchGroups.map(group => {
                  return <Option key={group._id} value={group._id}>{group.name}</Option>
                })}
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Button
                block
                type="primary"
                disabled={!selectedGroup}
                onClick={this.handleOnClick}
              >
                Next<Icon type="right"/>
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Home;
