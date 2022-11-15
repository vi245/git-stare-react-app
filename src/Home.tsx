import * as React from "react";
import './styles/home.css';
import SearchBox from './SearchBox';
function Home(){
    return (
        // HEADER
        <>
         <div className="heading flex center">
           <abbr title="Stare At Gits Without Loading Entire Github Page"><b>Git Stare</b></abbr>
        </div>
        <SearchBox></SearchBox>
        </>
    )
}
export default Home;