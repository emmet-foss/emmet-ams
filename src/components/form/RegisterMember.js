import React, { Component } from 'react';
import {
  Form, Input, Button, Checkbox, Col,
  PageHeader, Select, Row,
} from 'antd';

import emmetAPI from '../../emmetAPI';
import 'antd/dist/antd.css';
import './CreateForm.css';

const Option = Select.Option;

class RegisterMember extends Component {
  state = {
    response: [],
    churchLocales: [],
    selectedLocale: '',
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
    this.getChurchLocales()
      .then(res => {
        this.setState({ churchLocales: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');
        if (storedLocaleId) {
          this.setState({ selectedLocale: storedLocaleId })
        }
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchLocales()
      .then(res => {
        this.setState({ churchLocales: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');
        if (storedLocaleId) {
          this.setState({ selectedLocale: storedLocaleId })
        }
      })
      .catch(err => console.log(err));
    }
  }

  getChurchLocales = async () => {
    const response = await emmetAPI.getUrl('/ams/locale_churches')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleLocaleSelect = async (localeValue) => {
    this.setState({
      selectedLocale: localeValue
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { name, voiceDesignation, isUnderProbationary, isYouth, isWorker, selectedLocale } = this.state;
    const response = await emmetAPI.fetchUrl(`/ams/locale_churches/${selectedLocale}/music_ministry/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: name,
        voiceDesignation: voiceDesignation,
        isUnderProbationary: isUnderProbationary,
        isYouth: isYouth,
        isWorker: isWorker,
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

    const {
      churchLocales,
      selectedLocale,
    } = this.state;

    return (
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form {...formItemLayout}>
                  <Form.Item label="Locale">
                    <Select
                        showSearch
                        placeholder="Select a locale"
                        dropdownMatchSelectWidth={false}
                        onChange={value => this.setState({ selectedLocale: value })}
                        value={selectedLocale}
                      >
                        {churchLocales && churchLocales.map(locale => {
                          return <Option key={locale._id} value={locale._id}>{locale.name}</Option>
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
                    <Checkbox
                      onChange={e => this.setState({ isUnderProbationary: e.target.checked })}
                    >Under Probationary</Checkbox>
                    <Checkbox
                      onChange={e => this.setState({ isYouth: e.target.checked })}
                    >Youth</Checkbox>
                    <Checkbox
                      onChange={e => this.setState({ isWorker: e.target.checked })}
                    >Worker</Checkbox>
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
      </PageHeader>
    );
  }
}

export default RegisterMember;
