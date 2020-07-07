// Copyright 2020 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import * as Setting from "../Setting";
import * as NodeBackend from "../backend/NodeBackend";
import {withRouter} from "react-router-dom";
import * as TopicBackend from "../backend/TopicBackend";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import PageColumn from "./PageColumn";
import TopicList from "./TopicList";
import NewNodeTopicBox from "./NewNodeTopicBox";

class NodeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      nodeId: props.match.params.nodeId,
      topicNum: 1,
      topics: [],
      p: "",
      page: 1,
      limit: 20,
      minPage: 1,
      maxPage: -1,
      showPages: [],
      favoritesNum: 1,
      favoritesStatus: true,
      url: "",
    };
    const params = new URLSearchParams(this.props.location.search)
    this.state.p = params.get("p")
    if (this.state.p === null) {
      this.state.page = 1
    }else {
      this.state.page = parseInt(this.state.p)
    }

    this.state.url = `/go/${this.state.nodeId}`
  }

  componentDidMount() {
    this.getTopics()
    this.getNodeInfo()
  }

  getNodeInfo() {
    NodeBackend.getNode(this.state.nodeId)
      .then((res) => {
        this.setState({
          nodeInfo: res,
        });
      });
    NodeBackend.getNodeInfo(this.state.nodeId)
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            topicNum: res?.data,
            favoritesNum: res?.data2
          });
        }else {
          Setting.showMessage("error", res.msg)
        }
      });
    FavoritesBackend.getFavoritesStatus(this.state.nodeId, 3)
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            favoritesStatus: res.data,
          });
        }else {
          Setting.showMessage("error", res.msg)
        }
      });
  }

  getTopics() {
    TopicBackend.getTopicsWithNode(this.state.nodeId, this.state.limit, this.state.page)
      .then((res) => {
        this.setState({
          topics: res,
        });
      });
  }

  addFavorite() {
    FavoritesBackend.addFavorites(this.state.nodeId, 3)
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            favoritesStatus: res.data,
          });
          Setting.refresh()
        }else {
          Setting.showMessage("error", res.msg)
        }
      });
  }

  deleteFavorite() {
    FavoritesBackend.deleteFavorites(this.state.nodeId, 3)
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            favoritesStatus: !res.data,
          });
          Setting.refresh()
        }else {
          Setting.showMessage("error", res.msg)
        }
      });
  }

  showPageColumn() {
    return (
        <PageColumn page={this.state.page} total={this.state.favoritesNum} url={this.state.url}/>
      )
  }

  renderNode() {
    const {nodeInfo, nodeId, page, limit} = this.state
    let from, end
    if (this.state.topicNum !== 0) {
      from = (page - 1) * limit + 1
    }else {
      from = 0
    }
    end = (page - 1) * limit + this.state.topics.length

    return (
      <div className="box">
        <div className="node_header">
          <div className="node_avatar">
            <div style={{float: "left", display: "inline-block", marginRight: "10px", marginBottom: "initial!important"}}>
              <img src={nodeInfo?.image} border="0" align="default" width="72" alt={nodeInfo?.nodeName}/></div>
          </div>
          <div className="node_info">
            <div className="fr f12"><span>Total topics: </span>
              <strong>{this.state.topicNum}</strong>
              <span className="snow">&nbsp;•&nbsp;</span>
              {this.state.favoritesStatus ? <a onClick={() => {this.deleteFavorite()}} href="javascript:void(0)" className="node_header_link">Cancel favorite</a> : <a onClick={() => {this.addFavorite()}} href="javascript:void(0)" className="node_header_link">Add to favorite</a>}
            </div>
            <a href="/">{Setting.getForumName()}</a>
            <span className="chevron">&nbsp;›&nbsp;</span>
            {nodeInfo?.name}
            <div className="sep10"></div>
            <div className="sep5"></div>
            <div className="fr" style={{paddingLeft: "10px"}}>
              <input type="button" className="super normal button" value="new topic"
                     onClick={()=> {Setting.goToLink(`/new/${nodeId}`)}}/>
            </div>
            <span className="f12">{nodeInfo?.desc}</span>
            <div className="sep10"></div>
            <div className="node_header_tabs"><a href={`/go/${nodeId}`} className="node_header_tab_current">All topics</a>
              <a href={`/go/${nodeId}/links`} className="node_header_tab">Related links</a>
            </div>
          </div>
        </div>
        {this.showPageColumn()}
        <TopicList topics={this.state.topics} showNodeName={false} showAvatar={true} />
        {this.showPageColumn()}
        <div className="cell" align="center">
          <div className="fr">{`${this.state.favoritesNum} members have added this node to favorites`}</div>
          <span className="gray">{`Topic ${from} to ${end} of all ${this.state.topicNum} topics`}</span>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.nodeInfo == null) {
      return (
        <div id="Main">
          <div class="sep20"></div>
          <div class="box">
            <div class="header">
              <a href="/">{Setting.getForumName()}</a>
              <span className="chevron">&nbsp;›&nbsp;</span> Node not found</div>
            <div class="cell">
              The node you are trying to view does not exist, there are several possibilities:
              <div class="sep10"></div>
              <ul>
                <li>You entered a node ID that does not exist.</li>
                <li>The node is currently in invisible state.</li>
              </ul>
            </div>
            <div class="inner">
              {
                this.props.account === null ?
                  <span className="gray">
                    <span className="chevron">‹</span> &nbsp;Back to <a href="/">Home Page</a>
                  </span> :
                  <span className="gray">
                    <span className="chevron">‹</span> &nbsp;Back to <a href="/">Home Page</a>
                    <br/>
                    <span className="chevron">‹</span> &nbsp;Back to <a
                    href={`/member/${this.props.account?.id}`}>My profile</a>
                  </span>
              }
            </div>
          </div>
        </div>
      )
    }

    return (
        <div id="Main">
          <div className="sep20" />
          {this.renderNode()}
          <div className="sep20" />
          <NewNodeTopicBox nodeId={this.state.nodeId} size={"small"} />
        </div>
      )
  }
}

export default withRouter(NodeBox);
