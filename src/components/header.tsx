import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
    <div className="navbar navbar-default navbar-fixed-top" role="navigation">
    <div className="container">
        <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>

            <a className="navbar-brand" href=".">JalSthar</a>
        </div>

        <div className="navbar-collapse collapse">
 
                <ul className="nav navbar-nav">
                
                
                    <li className="active">
                        <a href=".">Dashboard</a>
                    </li>

                    <li >
                        <a href="reference/">Alerts & Notifications</a>
                    </li>
            
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">Maps <b className="caret"></b></a>
                        <ul className="dropdown-menu">
                           
<li >
    <a href="states/">States</a>
</li>
                                              
<li >
    <a href="districts/">Districts</a>
</li>
                         
<li >
    <a href="indian_village_boundaries/">India Village Boundaries(Maps)</a>
</li>
 </ul>
                    </li>                              
                </ul>
        </div>
    </div>
</div>
</>
 );
};

export default Header;
