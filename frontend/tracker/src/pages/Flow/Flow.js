import React, { useEffect, useState } from "react";
import "./Flow.css";

import { Form, Button, Space, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { loadUsers } from "../../http/user";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useStateValue } from "../../store/StateProvider";
import { useHistory } from "react-router-dom";
import { showNotification } from "../../utility/helper";
import { createFlow } from "../../http/document";

const { Option } = Select;

function Flow() {
  const [store, dispatch] = useStateValue();
  const [flowName, setFlowName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await loadUsers(store.token);
    const data = res.data;
    setEmployees(data);
    setLoading(false);
    console.log(data);
  };

  const onFinish = async (values) => {
    if (flowName && values) {
      const data = {
        flowName,
        flow: values.users,
      };
      const res = await createFlow(store.token, data);
      if (res.status === 200) {
        history.push("/");
        showNotification("Success", "Flow created successfully", "success");
      }
    } else {
      showNotification("Warning", "Fields cannot be blank", "warning");
    }
  };

  return (
    <div className="flow">
      {!loading ? (
        <>
          <h2 className="flow__header">Create Document Flow</h2>
          <hr className="divider" />
          <div className="flow__content">
            <div className="flow-type">
              <div className="flow-group">
                <label htmlFor="">Name of Flow</label>
                <input
                  type="text"
                  id="action-type"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                />
              </div>

              <div className="flow-action">
                <div className="action">
                  <h3 className="action__header">Add Actions</h3>
                  <Form
                    name="dynamic_form_nest_item"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.List name="users">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "employee"]}
                                rules={[
                                  { required: true, message: "Add Employee" },
                                ]}
                                style={{ width: "200px" }}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select a Employee"
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {employees.map((employee) => {
                                    return (
                                      <Option
                                        value={employee.employee_id}
                                        key={employee.employee_id}
                                      >
                                        {employee.first_name}{" "}
                                        {employee.last_name}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "action"]}
                                rules={[
                                  { required: true, message: "Add Action" },
                                ]}
                                style={{ width: "200px" }}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select action"
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  <Option value="forward">Forward</Option>
                                </Select>
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                              style={{
                                backgroundColor: "var(--light-brown)",
                                color: "var(--white)",
                                border: "none",
                                borderRadius: "5px",
                                marginTop: "15px",
                              }}
                            >
                              Add field
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        style={{
                          marginLeft: "353px",
                          backgroundColor: "var(--light-brown)",
                          color: "var(--white)",
                        }}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
}

export default Flow;
