import * as React from "react";
import './styles/home.css';


interface ButtonProps{
  type: 'reset'|'submit'|'button'|undefined;
};
const Button: React.FC<ButtonProps>=(props)=>{
    const {type}=props;
    return (
    <button className="search-button"  type={type}>Search</button>
       
    )
}
export default Button;