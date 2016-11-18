import React    from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider }                              from 'react-redux';
import thunkMiddleware                           from 'redux-thunk';
import { devTools, persistState }                from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor }      from 'redux-devtools/lib/react';
import rootReducer                               from './reducers/index'
import logger                                    from './middlewares/logger'
import Routes                                    from './config/Routes'

window.addEventListener('load', () => {
  const clientDOMNode = document.getElementById('client');
  if((typeof CLIENT_STATE.activity == "undefined" || CLIENT_STATE.activity == null) && (typeof CLIENT_STATE.page != "undefined" && CLIENT_STATE.page != null)){ 
    CLIENT_STATE.activity = CLIENT_STATE.page.activities[0];
    CLIENT_STATE.page.activities.forEach(act => { 
      if(act.id == CLIENT_STATE.user.current_activity_id){
        CLIENT_STATE.activity = act;
      }
    });
  }  

  let composeStore = compose(
    applyMiddleware(thunkMiddleware, logger),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  )(createStore);

  // Set up defaultState w/ default panel percentage
  let defaultState = {
    contentLoading: false,
    displayLanguage: 'en',
    panels: {
      resizing: false,
      percentage: 50
    },
    feedback: {
      showModal: false
    }
  };
  // Create remove function if not exist
  if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function() {
          if (this.parentNode) {
              this.parentNode.removeChild(this);
          }
      };
  }
  // Populate defaultState using server-rendered CLIENT_STATE
  defaultState = Object.assign(defaultState, CLIENT_STATE);

  let store = composeStore(rootReducer, defaultState);

  let unsubscribe = store.subscribe(() => {
    console.log(store.getState());
  });

  ReactDOM.render(
    <div>
      <Provider store={store}>
        <Routes />
      </Provider>
      {/*<DebugPanel top right bottom>
           <DevTools store={store} monitor={LogMonitor} />
         </DebugPanel>*/}
    </div>,
    clientDOMNode,
    function() {
      // Remove loading spinner from DOM
      const spinner = document.getElementById('client-loading');
      spinner.remove();
    }
  );
});
