import React, { Component } from 'react';
import { Divider ,Modal,Avatar,Checkbox,Icon,Button,Popover,Card} from 'antd';
import {Link } from 'react-router-dom';
import emitter from '.././util/events'
import { IPaddress } from '../App';
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;


class Tool extends Component{
    constructor(props){
        super(props);

        this.star = this.star.bind(this);
        this.openDownload = this.openDownload.bind(this);
        this.downloadCheck = this.downloadCheck.bind(this);
        this.cancelDownload = this.cancelDownload.bind(this);
        this.confirmDownload = this.confirmDownload.bind(this);
        this.openShare = this.openShare.bind(this);
        this.cancelShare = this.cancelShare.bind(this);
        this.confirmShare = this.confirmShare.bind(this);
        this.newNote = this.newNote.bind(this);

        this.state={
            paperID:this.props.paperID,
            username:sessionStorage.getItem('username'),
            toolIdx:null,
            isStar:false,
            clickTool:false,
        }
    }
    componentWillMount(){
        //是否收藏过
        let that  = this;
        let jsonbody = {};
        jsonbody.username = this.state.username;
        jsonbody.paperID = this.state.paperID;
        var url = IPaddress+'service/ifStar';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
        .then(response=>response.text())
        .then(responseJson=>{
            console.log(responseJson);
            let data = eval('('+responseJson+')');
            if(data.result == "fail"){
                alert("error");
            }
            else{
                that.setState({
                    isStar:data.ifStar
                })
            }
            console.log(data)
        }).catch(function(e){
            console.log("Oops, error");
        })
    }
    starPaper(){
        let that  = this;
        let jsonbody = {};
        jsonbody.username = this.state.username;
        jsonbody.paperID = this.state.paperID;
        var url = IPaddress+'service/starThePaper';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
        .then(response=>response.text())
        .then(responseJson=>{
            console.log(responseJson);
            let data = eval('('+responseJson+')');
            console.log(data)
        }).catch(function(e){
            console.log("Oops, error");
        })
    }
    quitStarPaper(){
        let that  = this;
        let jsonbody = {};
        jsonbody.username = this.state.username;
        jsonbody.paperID = this.state.paperID;
        var url = IPaddress+'service/quitStar/paper';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
        .then(response=>response.text())
        .then(responseJson=>{
            console.log(responseJson);
            let data = eval('('+responseJson+')');
            console.log(data)
        }).catch(function(e){
            console.log("Oops, error");
        })
    }
    star(){
        var star = this.state.isStar;
        this.setState({isStar:!star});
        if(!star){
            this.starPaper();
        }
        else{
            this.quitStarPaper();
        }
    }
    downloadCheck(checkvalue){
        console.log(checkvalue);
    }
    confirmDownload(){
        console.log("ok");
        this.setState({clickTool:false});        
    }
    cancelDownload(){
        console.log("cancel");
        this.setState({clickTool:false});
    }
    openDownload(){
        if(this.state.clickTool){
            return;
        }
        this.setState({clickTool:true})
        const options=["我的批注","标记的批注"];
        const content = (
            <div>
                <span>批注设置：</span>
                <CheckboxGroup options={options} onChange={this.downloadCheck} />
            </div>
          )
        confirm({
            title: '导出设置',
            content: content,
            iconType:"setting",
            onOk:this.confirmDownload,
            onCancel:this.cancelDownload
        });        
    }
    confirmShare(){
        console.log("ok");
        this.setState({clickTool:false});        
    }
    cancelShare(){
        console.log("cancel");
        this.setState({clickTool:false});
    }
    openShare(){
        if(this.state.clickTool){
            return;
        }
        this.setState({clickTool:true})
        
        const content = (
            <div>
                <Button shape="circle" style={{border:"none", backgroundColor:"#f50", verticalAlign: 'middle' }} size="large">
                <Icon type="weibo" style={{color:"white"}}/>
                </Button>
                <Divider type="vertical" />
                <Button shape="circle" style={{border:"none", backgroundColor:"#2db7f5", verticalAlign: 'middle' }} size="large">
                <Icon type="qq" style={{color:"white"}}/>
                </Button>
                <Divider type="vertical" />
                <Button shape="circle" style={{border:"none", backgroundColor:"#87d068", verticalAlign: 'middle' }} size="large">
                <Icon type="wechat" style={{color:"white"}} />
                </Button>
                
            </div>
          )
        confirm({
            title: '分享到',
            content: content,
            iconType:"fork",
            onOk:this.confirmShare,
            onCancel:this.cancelShare
        }); 
    }
    newNote(e){
        e.preventDefault();
        let jsonbody = {};
        jsonbody.username = this.state.username;
        jsonbody.paperID = this.state.paperID;
        let url = IPaddress + 'service/addNote';
        let options={};
        options.method='POST';
        options.headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'};
        options.body = JSON.stringify(jsonbody);
        fetch(url, options)
            .then(response=>response.text())
            .then(responseJson=>{
                let result = eval('(' + responseJson + ')');
                window.location.href='/user/modifyNote?noteID='+result.noteID;
            }).catch(function(e){
            console.log("Oops, error");
        })
    }
    rederToolContent(){
        return(
            <Card style={{ width: 240,height:90 }}>
                <Button shape="circle" icon="download" 
                onMouseEnter={()=>{this.setState({toolIdx:0})}} onMouseLeave={()=>{this.setState({toolIdx:null})}}
                onClick={this.openDownload} />
                <Divider type="vertical"/>
                <Button type={this.state.isStar?"primary":"default"} shape="circle" icon="star" 
                onMouseEnter={()=>{this.setState({toolIdx:1})}} onMouseLeave={()=>{this.setState({toolIdx:null})}}
                onClick={this.star}/>
                <Divider type="vertical" />
                <Button shape="circle" icon="fork" 
                onMouseEnter={()=>{this.setState({toolIdx:2})}} onMouseLeave={()=>{this.setState({toolIdx:null})}}
                onClick={this.openShare}/>
                <Divider type="vertical" />
                <Button shape="circle" icon="edit"
                onMouseEnter={()=>{this.setState({toolIdx:3})}} onMouseLeave={()=>{this.setState({toolIdx:null})}}
                onClick={this.newNote}>
                </Button>
                <br/>
                <div style={{marginTop:10}}>
                    <span style={{marginLeft:"2%"}}>{this.state.toolIdx==0?"导出":""}</span>
                    <span style={{marginLeft:"25%"}}>{this.state.toolIdx==1?(this.state.isStar?"取消":"收藏"):""}</span>
                    <span style={{marginLeft:"25%"}}>{this.state.toolIdx==2?"分享":""}</span>
                    <span style={{marginLeft:"25%"}}>{this.state.toolIdx==3?"写笔记":""}</span>
                </div>
            </Card>
        );
    }
    render(){
        const content = this.rederToolContent();
        return(
            <div id="tool" style={{zIndex:"100", position:"fixed",bottom:"5%",left:"2%"}}>
            <Popover 
            placement="topRight" content={content} trigger="click">
                <Button type="primary">
                <Icon type="tool" />Tool</Button>
            </Popover>
            </div>
        );
    }
}

export default Tool;
