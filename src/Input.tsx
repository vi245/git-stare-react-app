import * as React from "react";
import './styles/home.css';


interface InputProps{
  type:string;
  value:string;
  placeholder:string;
  onChange:(e: React.FormEvent<HTMLInputElement>)=>void;
}
const Input: React.FC<InputProps>=(props)=>{
    const {type,value,placeholder,onChange}=props;
    return (
     <input 
     className="input-box"
     type={type}
     value={value}
     placeholder={placeholder}
     onChange={onChange}
     >
     </input>
       
    )
}
export default Input;