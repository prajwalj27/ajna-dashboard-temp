import React, { useState, useEffect } from "react";
import { Table, Radio, Divider, Tag, Empty } from "antd";
import axios from "axios";
import Config from "../../../config/Config";
// import Spinner from '../../layouts/Spinner'
import PropTypes from "prop-types";
import { login, logout } from "../../../actions/user.actions";
import { setAlert } from "../../../actions/alert.actions";
import { showClientDetails } from "../../../actions/admin.actions";
import Loader from "react-loaders";

import { connect } from "react-redux";
const { Column } = Table;
let data = [];
class ClientList extends React.Component {
  state = {
    clients: [],
    id: "",
    clientId: "",
    contact: "",
    email: "",
    location: "",
    modules: [],
    selectedRow: "",
  };
  getClient = async (token) => {
    try {
      const res = await axios.get(Config.hostName + "/api/branch/accept", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-auth-token": token,
        },
      });

      this.setState({ clients: res.data });
    } catch (error) {
      // this.setState({ clients: 0 });

      console.log("admin dashboard", error);
    }
  };
  async componentWillReceiveProps() {
    (await this.props.auth) && this.getClient(this.props.auth.token);
  }
  async componentWillMount() {
    (await this.props.auth) && this.getClient(this.props.auth.token);
  }
  render() {
    data = [];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRow: selectedRowKeys });
        this.props.showClientDetails(selectedRows[0]);
      },
      getCheckboxProps: (record) => ({
        disabled: record.isActive === false,
        name: record.name,
      }),
    };

    {
      this.state.clients.length &&
        this.state.clients.map((i, index) => {
          i.isMaster === true || i.isMaster === "Yes"
            ? (i.isMaster = "Yes")
            : (i.isMaster = "No");
          let obj = Object.assign(i);
          obj.key = index;
          data.push(obj);
        });
    }

    return (
      <div>
        <h6>List Of Clients</h6>
        <Divider />
        {
          this.state.clients.length ? (
            <Table
              scroll={{ x: 1300 }}
              selection={1}
              rowSelection={{
                type: "radio",

                ...rowSelection,
              }}
              // columns={columns}
              dataSource={data}
              value={1}
            >
              <Column title="Client ID" dataIndex="clientId" key="clientId" />
              <Column title="Branch" dataIndex="branchName" key="branchName" />
              {/* <Column title="Name" dataIndex="name" key="name" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="Contact" dataIndex="contact" key="contact" /> */}
              <Column
                title="Modules"
                dataIndex="modules"
                key="modules"
                render={(tags) => (
                  <>
                    {tags.map((tag) => {
                      let color = "green";
                      return (
                        <Tag color={color} key={tag}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </>
                )}
              />
              <Column title="Location" dataIndex="location" key="location" />
              {/* <Column
                  title="Camera"
                  dataIndex="NoOfCameras"
                  key="NoOfCameras"
                /> */}
              <Column
                title="subscription"
                dataIndex="subscribed"
                key="subscribed"
              />
              <Column title="Amount Payed" dataIndex="amount" key="amount" />
            </Table>
          ) : (
            <Empty />
          )
          //   <Spinner/>
        }
      </div>
    );
  }
}

ClientList.propTypes = {
  setAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  showClientDetails: PropTypes.func.isRequired,
  admin: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  admin: state.admin,
});

export default connect(mapStateToProps, { setAlert, showClientDetails })(
  ClientList
);
