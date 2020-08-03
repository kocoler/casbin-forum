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
import {message} from "antd";
import moment from "moment";
import {animateScroll as scroll} from "react-scroll";
import md5 from 'js-md5'
import * as Conf from "./Conf"
import * as AccountBackend from "./backend/AccountBackend";
import * as MemberBackend from "./backend/MemberBackend";
import oss from "ali-oss";
import "./i18n"
import i18next from "i18next";

const pangu = require("pangu");

export let ServerUrl = '';
export let ClientUrl = '';

export function initServerUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    ServerUrl = `http://${hostname}:7000`;
  }
}

export function initFullClientUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    ClientUrl = `http://${hostname}:3000`;
  } else {
    ClientUrl = `https://${hostname}`;
  }
}

export function parseJson(s) {
  if (s === "") {
    return null;
  } else {
    return JSON.parse(s);
  }
}

export function scrollToTop() {
  scroll.scrollToTop();
}

export function scrollToBottom() {
  scroll.scrollToBottom();
}

export function refresh() {
  window.location.reload();
}

export function goToLink(link) {
  window.location.href = link;
}

export function openLink(link) {
  const w = window.open('about:blank');
  w.location.href = link;
}

export function getLink(link) {
  return <a target="_blank" href={link}>{link}</a>
}

export function showMessage(type, text) {
  if (type === "") {
    return;
  } else if (type === "success") {
    message.success(text);
  } else if (type === "error") {
    message.error(text);
  }
}

export function addRow(array, row) {
  return [...array, row];
}

export function deleteRow(array, i) {
  return [...array.slice(0, i), ...array.slice(i + 1)];
}

export function getFormattedDate(date) {
  date = date?.replace('T', ' ');
  date = date?.replace('+08:00', ' +08:00');
  return date;
}

export function getPrettyDate(date) {
  date = moment(date).fromNow();
  return date;
}

export function getDiffDays(date) {
  date = moment().diff(moment(date), 'days');
  return date;
}

export function getStatic(path) {
  return `https://cdn.jsdelivr.net/gh/casbin${path}`;
}

export function getUserAvatar(username, isLarge=false) {
  if (username === undefined) {
    return null;
  }

  let gravatarStr = md5(username)
  return `https://www.gravatar.com/avatar/${gravatarStr}?d=retro`
  //return getStatic(`/static@18114c607de851939b077a090946dc0623e4989c/gravatar/${username}${isLarge ? "" : "_48x48"}.png`);
}

export function getForumName() {
  return "Casbin Forum";
}

export function getGoogleAuthCode(method) {
  window.location.href=`${Conf.GoogleOauthUri}?client_id=${Conf.GoogleClientId}&redirect_uri=${ClientUrl}/callback/google/${method}&scope=${Conf.GoogleAuthScope}&response_type=code&state=${Conf.GoogleAuthState}`
}

export function getGithubAuthCode(method) {
  window.location.href=`${Conf.GithubOauthUri}?client_id=${Conf.GithubClientId}&redirect_uri=${ClientUrl}/callback/github/${method}&scope=${Conf.GithubAuthScope}&response_type=code&state=${Conf.GithubAuthState}`
}

export function getQQAuthCode(method) {
  window.location.href=`${Conf.QQOauthUri}?client_id=${Conf.QQClientId}&redirect_uri=forum.casbin.com&scope=${Conf.QQAuthScope}&response_type=code&state=${Conf.QQAuthState}`
}

export let OSSClient
export let OSSUrl
export let OSSFileUrl

export function initNewOSSClient(accessKeyId, accessKeySecret, stsToken) {
  let newClient
  newClient = new oss({
    region: Conf.OSSRegion,
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    bucket: Conf.OSSBucket,
    stsToken: stsToken
  });
  OSSClient = newClient
}

export function initOSSClient(id) {
  getOSSClient(initNewOSSClient)
  let url, fileUrl
  if (Conf.OSSCustomDomain.length !== 0) {
    url = `https://${Conf.OSSCustomDomain}/${Conf.OSSBasicPath}/${id}`
  } else {
    url = `https://${Conf.OSSBucket}.${Conf.OSSEndPoint}/${Conf.OSSBasicPath}/${id}`
  }
  fileUrl = `${Conf.OSSBasicPath}/${id}`
  OSSUrl = url
  OSSFileUrl = fileUrl
}

export function getOSSClient(initNewOSSClient) {
  AccountBackend.getStsToken().then((res) => {
    if (res.status === "ok") {
      initNewOSSClient(res.data.accessKeyId, res.data.accessKeySecret, res.data.stsToken)
    }
  });
}

export function SetLanguage() {
  let language = localStorage.getItem("casbin-forum-language");
  if (language === undefined || language == null) {
    let userLanguage
    userLanguage = navigator.language
    if (userLanguage === "zh-CN" || userLanguage === "zh") {
      language = "zh"
    } else {
      language = "en"
    }
  }
  i18next.changeLanguage(language)
  changeMomentLanguage(language)
}

export function ChangeLanguage(language) {
  localStorage.setItem("casbin-forum-language", language)
  i18next.changeLanguage(language)
  MemberBackend.updateMemberLanguage(language).then(() => goToLink("/"))
}

export function changeMomentLanguage(lng) {
  if (lng === "zh") {
    moment.locale('zh', {
      relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年'
      }
    })
  }
}

export function getFormattedContent(content) {
  return pangu.spacing(content.replace(/@(.*?)[ \n\t]|@([^ \n\t]*?)[^ \n\t]$/g, function (w) {
    if (w[w.length - 1] !== " ") {
      return `@[${w.substring(1, w.length)}](${ClientUrl}/member/${w.substring(1,)})`
    }
    return `@[${w.substring(1, w.length - 1)}](${ClientUrl}/member/${w.substring(1,)}) `
  }));
}

export function getBoolConvertedText(status) {
  if (status) {
    return i18next.t("general:true")
  }
  return i18next.t("general:false")
}
