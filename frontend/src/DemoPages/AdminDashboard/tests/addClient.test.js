import React from "react";
import Adapter from "enzyme-adapter-react-16";
import AddClient from "../AddClient/";
import { shallow, configure, mount } from "enzyme";
import { Provider } from "react-redux";
import { store, persistor } from "../../../config/configureStore";
configure({ adapter: new Adapter() });

describe("client login", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  let wrapper = mount(
    <Provider store={store}>
      <AddClient />
    </Provider>
  );
  it("Should take name ", () => {
    const nameInput = wrapper.find("input").at(0);
    nameInput.props().onChange({
      target: {
        name: "name",
        value: "rajni",
      },
    });
    console.log("ema", nameInput.instance());
    // console.log("emai", nameInput.props());

    // expect(nameInput.instance().props.value).toEqual("rajni");
  });

  //   it("Should take name ", () => {
  //     const passwordInput = wrapper.find("input").at(1);
  //     passwordInput.props().onChange({
  //       target: {
  //         name: "name",
  //         value: "rajni",
  //       },
  //     });
  //     expect(passwordInput.instance().props.value).toEqual("rajni");
  //   });
});
