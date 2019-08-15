import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button, Col, Icon,
  Select, Row,
} from 'antd';
import ReactGA from 'react-ga';
import * as qs from 'query-string';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;

class MembersHome extends Component {
  state = {
    members: [],
  };

  componentDidMount() {
    this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');

        const query = qs.parse(this.props.location.search);
        const { falseRedirect } = query;
        console.log('falseRedirect', falseRedirect)
        if (storedLocaleId && !falseRedirect) {
          this.setState({ selectedGroup: storedLocaleId })
          //this.props.history.push(`/church_groups/${storedLocaleId}/members`);
        }
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');
        if (storedLocaleId) {
          this.setState({ selectedGroup: storedLocaleId })
        }
      })
      .catch(err => console.log(err));
    }
  }

  getChurchGroups = async () => {
    const response = await emmetAPI.getUrl('/ams/church_groups')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSelect = async (value) => {
    ReactGA.event({
      category: 'Members Home',
      action: 'locale select'
    });
    this.setState({
      selectedGroup: value
    });
  };

  render() {
    const { churchGroups, selectedGroup } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <h3>From which locale would like to see its registered members?</h3>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a locale"
                dropdownMatchSelectWidth={false}
                onChange={this.handleSelect}
                value={selectedGroup}
              >
                {churchGroups && churchGroups.map(item => {
                  return <Option key={item._id} value={item._id}>{item.name}</Option>
                })}
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <NavLink to={`/church_groups/${selectedGroup}/members`}>
                <Button block type="primary" disabled={!selectedGroup}>
                  Next<Icon type="right"/>
                </Button>
              </NavLink>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default MembersHome;
