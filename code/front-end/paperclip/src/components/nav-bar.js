import React, { Component } from 'react';
import logo from '.././logo.svg';
import { Input,Icon, Avatar, Select,Menu, Dropdown, Popover,List, Button } from 'antd';
import { Row, Col } from 'antd';
import { Anchor } from 'antd';
import { Tabs } from 'antd';

import {Link} from 'react-router-dom';
import {log} from '../pages/loginpage';
import {log1} from '../pages/RegisterPage';

const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane

class NavBar extends Component{
    constructor(props){
        super(props);
        this.changeSearchIdx = this.changeSearchIdx.bind(this);
        this.state = {
            isLog:false,
            searchIdx:"empty"
        }
    }

    changeSearchIdx(e){
        var idx = e.target.value;
        if(idx == ""){
            idx = "empty";
        }
        this.setState({searchIdx:idx});
    }
    selectChange(value){
        console.log("select idx: " + value);
    }

    renderInfo(){
        const data1=[
            "一个桃子",
            "两只羊"
        ]
        const data2 = [
            {username:"大哥",desc:"大嘎达个"},
            {username:"大嫂",desc:"大大的"}
        ]
        return(
        <Tabs defaultActiveKey="1">
            <TabPane tab={<Icon type="smile-o" />} key="1">
            <List
                size="small"
                header={<div>这些人最近关注了你</div>}
                footer={<div>Footer</div>}
                dataSource={data2}
                renderItem={item => (<List.Item>
                    <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href="#">{item.username}</a>}
                    description={item.desc}
                    />
                  </List.Item>)}
            />
            </TabPane>
            <TabPane tab={<Icon type="bulb" />} key="2">
            <List
                size="small"
                header={<div>评论/回复</div>}
                footer={<div>Footer</div>}
                dataSource={data1}
                renderItem={item => (<List.Item>{item}</List.Item>)}
            />
            </TabPane>
        </Tabs>
      );
    }
    renderMessage(){
        const data = [
            {
              title: 'Ant Design Title 1',
            },
            {
              title: 'Ant Design Title 2',
            },
            {
              title: 'Ant Design Title 3',
            },
            {
              title: 'Ant Design Title 4',
            },
          ];
          
        return(
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href="#">{item.title}</a>}
                    description="Ant Design is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
            );
    }

    render() {
        const selectBefore = (
            <Select defaultValue="title" style={{ width: 90 }} onChange={this.selectChange}>
                <Option value="title">标题</Option>
                <Option value="author">作者</Option>
            </Select>
        );
        const buttonAfter = (
            <Link to={"/search/"+this.state.searchIdx}>
                <Icon type="search" />
            </Link>
        )        
        const search = (
                <Search
                addonBefore={selectBefore}
                placeholder="input search text"
                enterButton={buttonAfter}
                onChange={this.changeSearchIdx}
                />
        )
        const menu = (
            <Menu>
              <Menu.Item key="0">
                <Link to="/user"><Icon type="home" />我的主页</Link>
              </Menu.Item>
              <Menu.Item key="1">
                <a href="#"><Icon type="setting" />设置</a>
              </Menu.Item>
              <Menu.Item key="3"><Icon type="poweroff" />退出</Menu.Item>
            </Menu>
          );
        const message = this.renderMessage();
        const info = this.renderInfo();
        if(log||log1){
            return(
                <Anchor>
                    <Row type="flex" align="middle" justify="center">
                        <Col span={3}>
                            <Link to="/home"><img src={logo} width="60px" height="60px" alt="logo"/>Paperclip</Link>
                        </Col>
                        <Col span={1}><Link to='/home'>首页</Link></Col>
                        <Col span={1}><Link to='/discover'>发现</Link></Col>
                        <Col span={8} offset={1}>{search}</Col>
                        <Col span={1} offset={4}>
                            <Popover placement="bottom" title="我的消息" content={info} trigger="click">
                                <Icon type="bell" style={{ fontSize: 19, color: '#08c' }}/>
                            </Popover>
                        </Col>
                        <Col span={1}>
                            <Popover placement="bottom" title="我的私信" content={message} trigger="click">
                                <Icon type="message" style={{ fontSize: 19, color: '#08c' }}/>
                            </Popover>
                        </Col>
                        <Col span={1}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
                            </Dropdown>
                        </Col>
                        
                    </Row>
                </Anchor>
            )
        }
        else{
            return(
                <Anchor>
                    <Row type="flex" align="middle" justify="center">
                        <Col span={3}><Link to="/home"><img src={logo} width="60px" height="60px" alt="logo"/>Paperclip</Link></Col>
                        <Col span={1}><Link to='/home'>首页</Link></Col>
                        <Col span={1}><Link to='/discover'>发现</Link></Col>
                        <Col span={8} offset={1}>{search}</Col>                        
                        <Col span={1} offset={4}><Avatar icon="user" /></Col>
                        <Col span={1}><Link to="/login">Log in</Link></Col>
                    </Row>
                </Anchor>
            )
        }
    }
}

export default NavBar;