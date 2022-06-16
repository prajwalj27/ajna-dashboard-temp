import React, { useState } from 'react';
import { Table,TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

const PassedTabs = (props) => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div>
      <Nav tabs>
        <NavItem  className="bg-white ">
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Camera 1
          </NavLink>
        </NavItem>
        <NavItem className="bg-white ">
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Camera 2
          </NavLink>
        </NavItem>

      
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
                <Table hover responsive className="table-outline mb-0 d-none d-sm-table bg-white mb-5">
                  <thead className="thead-light">
                  <tr>
                    <th className="text-center">#</th>
                    <th>Timestamp</th>
                    <th className="text-center">Mask Status</th>
                    <th>Image Status</th>
                    <th className="text-center">Face Recognition</th>
                    <th>Image</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className="text-center td-light">
              1
                    </td>
                    <td>
                      <div>Mark</div>
                     
                    </td>
                    <td className="text-center">
                      Otto
                    </td>
                    <td>
                      <div className="text-center">
                       @mdo
                      </div>
                    </td>
                    <td className="text-center">
                    </td>
                    <td>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center td-light">
              2
                    </td>
                    <td>
                      <div>Mark</div>
                     
                    </td>
                    <td className="text-center">
                      Otto
                    </td>
                    <td>
                      <div className="text-center">
                       @mdo
                      </div>
                    </td>
                    <td className="text-center">
                    </td>
                    <td>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center td-light">
              3
                    </td>
                    <td>
                      <div>Mark</div>
                     
                    </td>
                    <td className="text-center">
                      Otto
                    </td>
                    <td>
                      <div className="text-center">
                       @mdo
                      </div>
                    </td>
                    <td className="text-center">
                    </td>
                    <td>
                    </td>
                  </tr>
                  </tbody>
                </Table>
              {/* <h4>Tab 1 Contents</h4> */}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
            Second Table
        </TabPane>
      </TabContent>
    </div>
  );
}

export default PassedTabs;