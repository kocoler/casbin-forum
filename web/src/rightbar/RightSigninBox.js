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
import i18next from "i18next";

class RightSigninBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    if (window.location.pathname === "/signin") {
      return (
        <div class="box">
          <div class="header">{i18next.t("bar:Other Sign In Methods")}</div>
          <div class="cell" style={{textAlign: "center"}}>
            <a onClick={() => Setting.getGoogleAuthCode("signup")} href="javascript:void(0)" class="google-signin" />
          </div>
          <div className="cell" style={{textAlign: "center"}}>
            <a onClick={() => Setting.getGithubAuthCode("signup")} href="javascript:void(0)" className="github-signin">Sign in with Github</a>
          </div>
        </div>
      )
    }

    return (
      <div className="box">
        <div className="cell">
          <strong>Casbin = way to authorization</strong>
          <div className="sep5" />
          <span className="fade">A place for Casbin developers and users</span>
        </div>
        <div className="inner">
          <div className="sep5" />
          <div align="center">
            <a href="/signup" className="super normal button">{i18next.t("bar:Sign Up Now")}</a>
            <div className="sep5" />
            <div className="sep10" />
            {i18next.t("bar:For Existing Member")}{" "}&nbsp;<a href="/signin">{i18next.t("bar:Sign In")}</a>
            <div className="sep10" />
            <div>
              <a onClick={() => Setting.getGithubAuthCode("signup")} href="javascript:void(0)" className="github-signin">
                <img src={"https://testko.oss-cn-beijing.aliyuncs.com/qq.png"}/>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RightSigninBox;
