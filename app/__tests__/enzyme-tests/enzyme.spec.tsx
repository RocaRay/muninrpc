import * as React from 'react';
import { configure, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
const sinon = require('sinon')

// import components
import { Header } from "../../src/components/Header";
import { Right } from "../../src/components/Right"
import App from "../../src/App";

configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('Header', () => {
    let wrapper;
    let props = {
      tabInfo: { 
        tab0: {
          name: "New Connection",
          activeResponseTab: "server"
        }
      },
      updateTabNames: null,
      handlerInfo: {},
      handleClientStreamStart: null,
      handleServerStreamStart: null,
      handleBidiStreamStart: null,
      handleUnaryRequest: null,
      toggleStream: null,
      activeTab: { requestConfig: {}, baseConfig: {grpcServerURI: "testURL"} },
      getTabState: null,
      selectTab: null,
      removeTab: null,
      addNewTab: null,
      leftArray: [{
        props: {
          tabKey: 'tab0',
        }
      }],
      selectedTab: null,
      handleStopStream: null,
    };

    beforeAll(() => {
      wrapper = shallow(<Header {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toBeTruthy()
    });

    it('should display a url based on the value of activeTab.baseConfig.grpcServerURI', () => {
      expect(wrapper.find('.trail').text()).toBe('testURL → ');
    });

    it('should display a tab based on the contents of LeftArray', () => {
      expect(wrapper.find('.tab')).toBeTruthy();
    });

    it('should display a tab title based on the value of tabInfo', () => {
      expect(wrapper.find('.tab').text()).toBe('New Connection');
    });

    it('should display a default tab title if the user does not provide one', () => {
      wrapper.setProps({
        tabInfo: {}
      })
      expect(wrapper.find('.tab').text()).toBe('Connection');
    });

  });

  describe('Right', () => {
    let wrapper;
    let props = {
      // selectResponseTab: null,
      tabInfo: {
        tab0: {
          name: "New Connection",
          activeResponseTab: "server"
        }
      },
      handlerInfo: {
        tab0: {
          isStreaming: 'false',
          responseMetrics: {
            timeStamp: "15:34:33",
            request: 'Request GetList sent to localhost:50052'
          },
          serverResponse: [{type: 'read', payload: {items: []}}, {type: 'write', payload: {}}]
        }
      },
      selectedTab: 'tab0',
      leftArray: [{
        props: {
          tabKey: 'tab0',
        }
      }]
    }

    beforeAll(() => {
      wrapper = shallow(<Right {...props}/>)
    })

    it('should render', () => {
      expect(wrapper).toBeTruthy();
    })

    it('Right should have two tabs', () => {
      expect(wrapper.find('.right-header-box').children().length).toBe(2)
    })

    it('Should have a metrics display that contains a timestamp and a status', () => {
      // expect(wrapper.find('.response-metrics').children().hasClass('metrics-time')).toBeTruthy()
      expect(wrapper.find('.response-metrics').children().at(0).text()).toBe('[15:34:33]');
      expect(wrapper.find('.response-metrics').children().at(1).text()).toBe('Request GetList sent to localhost:50052');
    })

    // it('Should display server response', () => {
    //   expect(wrapper.find('.response-display').text()).toBeTruthy()
    // })

    // it('Should display a log of client messages', () => {
    //   expect(wrapper.find('.tab').get(1).text()).toBe('CLIENT MESSAGES');
    // })
  })
});

