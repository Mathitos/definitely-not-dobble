import 'phoenix_html'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Root from './Root'

import './style-reset.scss'

// This code starts up the React app when it runs in a browser. It sets up the routing
// configuration and injects the app into a DOM element.
ReactDOM.render(<Root />, document.getElementById('definitely-not-dobble-root'))
