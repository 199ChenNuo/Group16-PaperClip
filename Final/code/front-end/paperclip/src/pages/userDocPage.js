import React, { Component } from 'react';
import { List, Avatar, Popconfirm, Menu, Anchor, Button, Icon, Divider,Table, message } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import NavBar from '../components/nav-bar';
import UserFLoatMenu from '../components/userFloatMenu';
/* should get from server */
import { IPaddress } from '../App'

var username = '';

class UserDoc extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            columns: [{
                align:'center',
                title: '文档名',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => (
                    <a href={"/user/docdetail?docID=" + record.ID}>{text}</a>
                )
            }, {
                align:'center',
                title: '上次修改日期',
                dataIndex: 'date',
                key: 'date',
            },  {
                align:'center',
                title: <Button type="primary" onClick={this.newDoc}>新建文档</Button>,
                key: 'action',
                render: (text, record) => (
                    <span>
                    <a href={"/user/modifyDoc?docID=" + record.ID}>编辑文档</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.deleteDoc(text, record)}>删除文档</a>
                    <Divider type="vertical" />
                    <a href={"/user/docdetail?docID=" + record.ID}>查看文档版本</a>
                </span>
                ),
            }],
        }
    }

    componentWillMount = () => {
        if(sessionStorage.getItem('username') == null){
            window.location.href='/login';
            return;
        }
        let that = this;
        /* get username */
        username = sessionStorage.getItem('username');
        /* get docs according to username */
        let jsonbody = {};
        jsonbody.username = username;
        let url = IPaddress + 'service/userDoc';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
            .then(response=>response.text())
            .then(responseJson=>{
                let data = eval(responseJson);
                data.sort(that.sortArray);
                that.setState({
                    data: data
                })
            }).catch(function(e){
            console.log("Oops, error");
        })
    }
    deleteDoc = (record, item) => {
        let that = this;
        let jsonbody = {};
        jsonbody.username = username;
        jsonbody.docID = item.ID;
        console.log(jsonbody);
        let url = IPaddress + 'service/delete/doc';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
            .then(response=>response.text())
            .then(responseJson=>{
                let result = eval('('+responseJson+')');
                if(result.result == "success"){
                    let tmpdata = that.state.data;
                    let dataLen = tmpdata.length;
                    for(let i=0; i<dataLen; i++){
                        if(tmpdata[i].ID == item.ID){
                            tmpdata.splice(i, 1);
                            break;
                        }
                    }
                    that.setState({
                        data: tmpdata,
                    })
                }
                else{
                    message.error('删除失败，请重试', 3);
                }
            }).catch(function(e){
            console.log("Oops, error");
        })
    }
    newDoc = () => {
        var tmpdata = this.state.data;
        let jsonbody = {};
        jsonbody.username = username;
        jsonbody.title = 'new doc';
        jsonbody.content='';
        let url = IPaddress + 'service/addDoc';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
            .then(response=>response.text())
            .then(responseJson=>{
                let result = eval('(' + responseJson + ')');
                if(result.result != "success"){
                    message.error("新建失败，请重试", 3);
                }
                else{
                    let obj={
                        ID: result.docID,
                        title: 'new doc',
                        date: result.date
                    };
                    tmpdata.push(obj);
                    this.setState({
                        data: tmpdata
                    })
                    window.location.href='/user/modifyDoc?docID='+result.docID;
                }
            }).catch(function(e){
            console.log("Oops, error");
        })
    }
    sortArray(obj1, obj2){
        if(obj1.date < obj2.date){
            return 1;
        }
        else if(obj1.date > obj2.date){
            return -1;
        }
        else{
            return 0;
        }
    }
    render(){
        if(sessionStorage.getItem('username') == null){
            return <Redirect to="/login"/>;
        }
        return(
            <div>
                <NavBar />
            <UserFLoatMenu />
            <div 
            style={{width:'60%',marginLeft:'200px',paddingTop:'60px',backgroundColor:"white",boxShadow:"0px 1px 3px #BDBCBC",
            borderRadius:"2px",padding:"10px 20px",marginTop:"3%",marginBottom:"2%"}}>
                <Table
                    pagination={{defaultPageSize: 8}}
                    style={{textAlign:'center'}} columns={this.state.columns} dataSource={this.state.data} />
            </div>
        </div>
        )
    }
}

export default UserDoc;
