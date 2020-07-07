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

package object

type Tab struct {
	Id          string `xorm:"int notnull pk"`
	TabId       string `xorm:"varchar(100)" json:"id"`
	TabName     string `xorm:"varchar(100)" json:"name"`
	CreatedTime string `xorm:"varchar(100)"`
	DefaultNode string `xorm:"varchar(100)" json:"defaultNode"`
	HomePage    bool   `xorm:"bool"`
}

func GetTab(id string) *Tab {
	tab := Tab{TabId: id}
	existed, err := adapter.engine.Get(&tab)
	if err != nil {
		panic(err)
	}

	if existed {
		return &tab
	} else {
		return nil
	}
}

func GetTabs() []*Tab {
	tabs := []*Tab{}
	err := adapter.engine.Where("home_page = ?", 1).Find(&tabs)
	if err != nil {
		panic(err)
	}

	return tabs
}

func GetDefaultTab() string {
	var tab Tab
	_, err := adapter.engine.Where("home_page = ?", 1).Limit(1).Get(&tab)
	if err != nil {
		panic(err)
	}

	return tab.TabId
}

func GetNodesByNode(id string) []*Node {
	nodes := []*Node{}
	err := adapter.engine.Where("tab_id = ?", id).Cols("id, name").Find(&nodes)
	if err != nil {
		panic(err)
	}

	return nodes
}
