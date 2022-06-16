import React from "react";
import Adapter from "enzyme-adapter-react-16";
import ClientLogin from "../ClientLogin/";
import { shallow, configure, mount } from "enzyme";
import { Provider } from "react-redux";
import { store, persistor } from "../../../config/configureStore";
configure({ adapter: new Adapter() });
describe("client login", () => {
  let wrapper = mount(
    <Provider store={store}>
      <ClientLogin />
    </Provider>
  );
  it("Should take email address", () => {
    const emailInput = wrapper.find("Input").at(0);
    emailInput.props().onChange({
      target: {
        name: "email",
        value: "rajni@ajna.ai",
      },
    });
    expect(emailInput.instance().props.value).toEqual("rajni@ajna.ai");
  });

  it("Should take Password ", () => {
    const passwordInput = wrapper.find("Input").at(1);
    passwordInput.props().onChange({
      target: {
        name: "password",
        value: "123456",
      },
    });
    expect(passwordInput.instance().props.value).toEqual("123456");
  });

  it("Should take Type ", () => {
    const typeInput = wrapper.find("Select").at(0);
    typeInput.props().onChange("client");
    expect(typeInput.instance().props.value).toEqual("client");
  });
});
