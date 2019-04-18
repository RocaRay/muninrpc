import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "./actions";
import { MainModel } from "./models";
import MyTypes from "./store"

type AppProps = {
  main: MainModel;
};

// import components
import { Right, Header } from "./components";

const MapStateToProps = store => ({
  selectedTab: store.main.selectedTab,
  leftArray: store.main.leftArray,
  activeTab: store.main.activeTab,
  handlerInfo: store.main.handlerInfo,
  handlers: store.main.handlers,
  isStreaming: store.main.isStreaming,
  tabInfo: store.main.tabInfo
});

const MapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators(actions, dispatch);

class App extends React.Component<AppProps & actions, {}> {
  constructor(props: AppProps & actions) {
    super(props);
    this.props.addNewTab({ getTabState: this.props.getTabState, updateTabNames: this.props.updateTabNames, setGRPCResponse: this.props.setGRPCResponse });
  }

  render() {
    let selectedIdx;
    this.props.leftArray.forEach((ele, idx) => {
      if (ele.key === this.props.selectedTab) {
        selectedIdx = idx;
      }
    });

    return (
      <div className="wrapper">
        <Header {...this.props} />
        <div className="app">
          <div className="left-half">{this.props.leftArray[selectedIdx]}</div>
          <Right {...this.props} />
        </div>
      </div>
    );
  }
}

//export a connected version of <App/>
export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(App);
