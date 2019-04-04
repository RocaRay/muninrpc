import * as React from "react";
import { element } from "prop-types";
import { JSXSpreadChild } from "@babel/types";
import { request } from "http";

export namespace SetupProps {
  export interface Props {
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
    
    configElements: any;
    configArguments: any;

    handleRepeatedClick: any;
    handleConfigInput: any;
  }
}

export default function Setup(props: SetupProps.Props, context?: any) {
  let { handleConfigInput, handleRepeatedClick, serviceList, selectedService, selectedRequest } = props;

  function findNestedValue(context, keyArray) {
    // base case
    if (keyArray.length === 1) {
      let loc = Number(keyArray[0].match(/\d+$/)[0]);
      let con = keyArray[0];
      con = con.match(/(.+)@/)[1];
      return context[con][loc]
    }
    // recu case
    if (keyArray[0].match("@")) {
      let loc = Number(keyArray[0].match(/\d+$/)[0]);
      let con = keyArray[0];
      con = con.match(/(.+)@/)[1];
      return findNestedValue(context[con][loc], keyArray.slice(1));
    } else {
      return findNestedValue(context[keyArray[0]], keyArray.slice(1));
    }
  }


  function generateFields(cfgArgs: any, cfgEle:any, depth = 0, path = ''): JSX.Element[] | JSX.Element  {
    // logic for constructing elements

    if(cfgArgs) {
      if ( (Object.keys(cfgArgs).length === 0) || (cfgArgs.length === 0) ) {
        additionalMessages.push(
          <p className="no-fields" style={ { marginLeft: (depth-1) * 20 - 5 + 'px' } }>
            This message has no fields.
          </p>
        )
      } else {
        Object.keys(cfgArgs).forEach( field => {
          // case: is repeating
          if( Array.isArray(cfgEle[field]) ) {
            // is a repeating message
            if( cfgEle[field][0].type === 'TYPE_MESSAGE') {
              let pos = additionalMessages.length;
              cfgArgs[field].forEach( (ele, idx) => {
                additionalMessages.push(
                  <li style={ 
                    {
                      marginLeft: (depth-1) * 20 + 'px',
                      borderTop: idx === 0 ? `1px solid #2699FB` : ``,
                      borderTopLeftRadius: idx === 0 ? '10px' : ''
                    } 
                  }>
                    <button onClick={() => handleRepeatedClick({ id: path+'.'+field+'@'+idx, request: 'add'   }) } >
                      +
                    </button>
                    <button onClick={() => handleRepeatedClick({ id: path+'.'+field+'@'+idx, request: 'remove' }) } >
                      -
                    </button>
                    <div className="li-body">
                      <div className="li-body-top">
                        <div className="name">{idx} : {cfgEle[field][0].messageName} : {field}</div>
                      </div>
                      <div className="li-body-bottom">
                        <div className="message">{cfgEle[field][0].type} </div>
                        <div className="type">{cfgEle[field][0].label}</div>
                      </div>
                    </div>
                  </li>
                )
                generateFields(cfgArgs[field][idx], cfgEle[field][0], depth+1, path+'.'+field+'@'+idx)
              })
            } 
          // case: is non-repeating
          } else {
            // is a non-repeating message
            if( cfgEle[field].type === 'TYPE_MESSAGE') {
              let pos = additionalMessages.length;
              additionalMessages.push(
                <li style={ 
                  {
                    marginLeft: (depth-1) * 20 + 'px',
                  } 
                }>
                  <div className="li-body">
                    <div className="li-body-top">
                      <div className="name">{cfgEle[field].typeName} : {field}</div>
                    </div>
                    <div className="li-body-bottom">
                      <div className="message">{cfgEle[field].type} </div>
                      <div className="type">{cfgEle[field].label}</div>
                    </div>
                  </div>
                </li>
              )  
            generateFields(cfgArgs[field], cfgEle[field], depth+1, path+'.'+field)
            // is a repeating non-message
            } else if(cfgEle[field].label === 'LABEL_REPEATED') {
              let pos = additionalMessages.length;
              cfgArgs[field].forEach( (ele, idx) => {
                additionalMessages.push(
                  <li style={ 
                    {
                      marginLeft: (depth-1) * 20 + 'px',
                      borderTop: idx === 0 ? `1px solid #2699FB` : ``,
                      borderTopLeftRadius: idx === 0 ? '10px' : ''
                    } 
                  }>
                    <button onClick={() => handleRepeatedClick({ id: path+'.'+field+'@'+idx, request: 'add'   }) } >
                      +
                    </button>
                    <button onClick={() => handleRepeatedClick({ id: path+'.'+field+'@'+idx, request: 'remove' }) } >
                      -
                    </button>
                    <div className="li-body">
                      <div className="li-body-top">
                        <div className="name">{idx} : {field}</div>
                      </div>
                      <div className="li-body-bottom">
                        <div className="message">{cfgEle[field].type}</div>
                        <div className="type">{cfgEle[field].label}</div>
                      </div>
                    </div>
                    <input 
                      id={path+'.'+field+'@'+idx}
                      value={ findNestedValue(props.configArguments.arguments, (path+'.'+field+'@'+idx).split(".").slice(1)) }
                      className={pos} 
                      onChange={(e) => handleConfigInput({id: path+'.'+field+'@'+idx, value: e.target.value}) }/>
                  </li>
                )
              })  
            // is a non-repeating non-message
            } else {
              let pos = additionalMessages.length;
              additionalMessages.push(
                <li style={ 
                  {
                    marginLeft: (depth-1) * 20 + 'px',
                  } 
                }>
                  <div className="li-body">
                    <div className="li-body-top">
                      <div className="name">{field}</div>
                    </div>
                    <div className="li-body-bottom">
                      <div className="message">{cfgEle[field].type}</div>
                      <div className="type">{cfgEle[field].label}</div>
                    </div>
                  </div>
                  <input id={path + '.' + field} className={pos} onChange={(e) => handleConfigInput({id: path+'.'+field, value: e.target.value}) }/>
                </li>
              )
            }
          }
        })
      }
    }
  }

  const additionalMessages: JSX.Element[] | JSX.Element = [] = []
  generateFields(props.configArguments.arguments, props.configElements.arguments);

  return (
    <div className="setup">
      <h2>Setup</h2>
      <div className="setup-header">
        <input type="text" placeholder="search for messages" />
      </div>
      <div className="setup-area">{additionalMessages}</div>
    </div>
  );
}
