import React from 'react';
import 'antd/dist/antd.css';
import locale from 'antd/es/date-picker/locale/es_ES';
import debounce from 'lodash/debounce';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Select,
  Checkbox,
  Button,
  DatePicker,
  Spin
} from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {isPlaying} from '../actions';
const { Option } = Select;
const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }]
};


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchCountry = debounce(this.fetchCountry, 800);
  }
  state = {
    confirmDirty: false,
    data: [],
    value: [],
    fetching: false,
    redirectLogin: false
  };

  componentDidMount() {
    this.props.dispatch(isPlaying(false));
  }

  fetchCountry = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch(`https://restcountries.eu/rest/v2/name/${value}`)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        let data;

        if (body.length > 0) {
          data = body.map(country => ({
            text: country.name,
            value: country.alpha3Code
          }));
        } else {
          data = [{ text: 'country not found', value: 'error' }];
        }
        this.setState({ data, fetching: false });
      });
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        axios
          .post('/user/register', values, {timeout: 10000})
          .then(this.setState({ redirectLogin: true }))
          .catch(err => alert(err));
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+54'
    })(
      <Select style={{ width: 80 }}>
        <Option value='54'>+54</Option>
        <Option value='591'>+591</Option>
        <Option value='56'>+56</Option>
        <Option value='506'>+506</Option>
        <Option value='53'>+53</Option>
        <Option value='809'>+809</Option>
        <Option value='593'>+593</Option>
        <Option value='502'>+502</Option>
        <Option value='52'>+52</Option>
        <Option value='51'>+51</Option>
      </Select>
    );

    if (this.state.redirectLogin) return <Redirect to='/login' />;

    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        className='centered-div'>
        <Form.Item
          label={
            <span>
              Full Name&nbsp;
              <Tooltip title='Enter in this format: FirstName LastName'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('fullname', {
            rules: [
              {
                required: true,
                message: 'Please input your full name!',
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title='What do you want others to call you?'>
                <Icon type='question-circle-o' />
              </Tooltip>
            </span>
          }>
          {getFieldDecorator('nickname', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label='Birthday'>
          {getFieldDecorator('birthday', config)(
            <DatePicker locale={locale} />
          )}
        </Form.Item>
        <Form.Item label='E-mail'>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label='Password' hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label='Confirm Password' hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

        <Form.Item label='Select Country'>
          {getFieldDecorator('country', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!'
              }
            ]
          })(
            <Select
              showSearch
              showArrow={false}
              labelInValue
              setFieldsValue={this.state.value}
              placeholder='Select country'
              notFoundContent={
                this.state.fetching ? <Spin size='small' /> : null
              }
              filterOption={false}
              onSearch={this.fetchCountry}
              onChange={this.handleChange}
              style={{ width: '100%' }}
              allowClear
              checked={true}>
              {this.state.data.map(d => (
                <Option key={d.value}>{d.text}</Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Phone Number'>
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: 'Please input your phone number!' }
            ]
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked'
          })(
            <Checkbox>
              I have read the <a href='/'>agreement</a>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegister = Form.create({ name: 'register' })(Register);
export default connect()(WrappedRegister);
