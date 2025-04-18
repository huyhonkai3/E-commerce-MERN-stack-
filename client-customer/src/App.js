// App.js
import './App.css';
import React, { Component } from 'react';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'font-awesome/css/font-awesome.min.css';
import MyProvider from './context/MyProvider';

class App extends Component {
    render() {
        return (
            <HelmetProvider>
                <MyProvider>    
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </MyProvider>
            </HelmetProvider>
        );
    }
}

export default App;
