import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Col, Icon, Row, Spin, Table } from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './List.css';

const columns = [
  {
    title: 'No',
    dataIndex: '_id',
    key: '_id',
    render: _id =>
      <NavLink
        style={{ padding: 10 }}
        to={`/members/${_id}`}
      >
        <Icon type={"edit"}/>
      </NavLink>
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: name => <span>{name}</span>,
  },
];

class MembersList extends Component {
  state = {
    members: [],
    localeInfo: {},
    loadingMembers: false,
    loadingLocaleInfo: false,
  };

  componentDidMount() {
    this.getMembers()
      .then(res => this.setState({ members: res.members, loadingMembers: false }))
      .catch(err => console.log(err));

      this.getLocaleInfo()
        .then(res => {
          this.setState({ localeInfo: res.locale, loadingLocaleInfo: false })
        })
        .catch(err => console.log(err));  
    }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMembers()
        .then(res => this.setState({ members: res.members, loadingMembers: false }))
        .catch(err => console.log(err));

        this.getLocaleInfo()
        .then(res => {
          this.setState({ localeInfo: res.locale, loadingLocaleInfo: false })
        })
        .catch(err => console.log(err));  
    }
  }

  getMembers = async () => {
    this.setState({ loadingMembers: true });
    const localeId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}/members`);
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

  render() {
    const { members, localeInfo, loadingMembers, loadingLocaleInfo } = this.state;
    const loading = (loadingMembers || loadingLocaleInfo);

    let modMembers = [];
    if (members.length > 0) {
      let i = 0;
      members.forEach(item => {
        modMembers.push({ ...item, key: i++ });
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
              {(members && members.length === 0) ?
                <div>
                  <h3>{`Sorry, but there are no members registered the locale of ${localeInfo.name}.`}</h3>
                  <div>
                    <span>Would you like to register a member?</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/members/new`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/members`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="cross"/>No
                      </Button>
                    </NavLink>
                  </div>
                </div>
              :
                <div>
                  <h3>Here are the members registered in the locale of {`${localeInfo.name}:`}</h3>
                  <Table pagination={false} columns={columns} dataSource={modMembers} />

                  <span>Would you like to register another member?</span>
                  <div style={{ display: 'flex', justify: 'center' }} >
                    <NavLink
                      style={{ padding: 10 }}
                      to={`/locale_church/${localeInfo._id}/members/new`}
                    >
                      <Button type="primary" size="small">
                        <Icon type="check"/>Yes
                      </Button>
                    </NavLink>
                    <NavLink
                      style={{ padding: 10 }}
                      to={"/members?falseRedirect=true"}
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

export default MembersList;
