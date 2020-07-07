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

import * as Setting from "../Setting";

export function getTabs() {
  return fetch(`${Setting.ServerUrl}/api/get-tabs`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getTab(id) {
  return fetch(`${Setting.ServerUrl}/api/get-tab?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}

export function getTabNodes(id) {
  return fetch(`${Setting.ServerUrl}/api/get-tab-nodes?id=${id}`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.json());
}
