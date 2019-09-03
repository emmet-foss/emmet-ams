import React, { Component } from 'react';
import {
  Form, Input, Button, Checkbox, Col,
  Select, Row,
} from 'antd';

import emmetAPI from '../../emmetAPI';
import 'antd/dist/antd.css';
import './CreateForm.css';

const Option = Select.Option;

class RegisterMember extends Component {
  state = {
    response: [],
    churchGroups: [],
    selectedGroup: '',
    name: '',
    memberType: '',
    voiceDesignation: '',
    location: '',
    responseToPost: '',
    collapsed: false,
    isUnderProbationary: false,
    isYouth: false,
    isWorker: false,
  };

  componentDidMount() {
    this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.church_groups })
        const churchGroupId = this.props.location.pathname.split('/')[2];
        this.setState({ selectedGroup: churchGroupId })
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.church_groups })
        const churchGroupId = this.props.location.pathname.split('/')[2];
        this.setState({ selectedGroup: churchGroupId })
      })
      .catch(err => console.log(err));
    }
  }

  getChurchGroups = async () => {
    const response = await emmetAPI.getUrl('/ams/church_groups?ministryName=music%20ministry')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleLocaleSelect = async (value) => {
    this.setState({ selectedGroup: value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { name, churchId, voiceDesignation, isUnderProbationary, isYouth, isWorker, selectedGroup } = this.state;
    const response = await emmetAPI.fetchUrl(`/ams/church_groups/${selectedGroup}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name,
        churchId,
        voiceDesignation,
        isUnderProbationary,
        isYouth,
        isWorker,
      }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const { churchGroups, selectedGroup } = this.state;

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form {...formItemLayout}>
                <Form.Item label="Locale Choir">
                  <Select
                      showSearch
                      placeholder="Select a choir group"
                      dropdownMatchSelectWidth={false}
                      onChange={value => this.setState({ selectedGroup: value })}
                      value={selectedGroup}
                    >
                      {churchGroups && churchGroups.map(item => {
                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                      })}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item
                  label="Name:"
                >
                  <Input
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </Form.Item>
                <Form.Item
                  label="Church Id:"
                >
                  <Input
                    value={this.state.churchId}
                    onChange={e => this.setState({ churchId: e.target.value })}
                  />
                </Form.Item>
                <Form.Item
                  label="Voice Designation:"
                >
                  <Select
                    dropdownMatchSelectWidth={false}
                    onChange={value => this.setState({ voiceDesignation: value })}
                  >
                    <Option value="s">Soprano</Option>
                    <Option value="a">Alto</Option>
                    <Option value="t">Tenor</Option>
                    <Option value="b">Bass</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Other Statuses:"
                >
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={24}>
                        <Checkbox
                          onChange={e => this.setState({ isUnderProbationary: e.target.checked })}
                          value="1"
                        >Under Probationary</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Checkbox
                          onChange={e => this.setState({ isYouth: e.target.checked })}
                          value="2"
                        >Youth</Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Checkbox
                          onChange={e => this.setState({ isWorker: e.target.checked })}
                          value="3"
                        >Worker</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button block type="primary" htmlType="submit">Register</Button>
                  <p>{this.state.responseToPost}</p>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default RegisterMember;
