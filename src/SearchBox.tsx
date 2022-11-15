import { useState } from "react";
import * as React from "react";
import './styles/home.css'
import Input from './Input';
import Button from "./Button";
import axios from 'axios';
import { stringify } from "querystring";

  export interface payload{
    payload :{
        size:number;
        commits:[{
            message:string;
            sha:string;
        }];
    }
  }
  export interface actor {
 actor:{
    avatar_url: string;
    display_login: string;
    url : string;
    login:string;
 } ;
  }
  export interface repo {
    repo:{
        name :string;
        url :string;
    }
    
  }
  export interface Mydata extends actor , repo,payload {
    id: number;
    type: string;
    created_at : string;  
  } 
  export interface userEvents{
    public_repos: number;
    public_gists: number;
    followers: number;
    following:number;
    html_url:string;
    avatar_url:string;
    login:string;
  }
 type userSchema= string | null;
const SearchBox: React.FC=()=>{
    const [name,setName]=useState<string>('');
    const [data,setData]=useState<Mydata[]>([]);
    const [event,setEvent]=useState<userEvents>();
    const [suggestions,setSuggestions]=useState<string[]>([]);
    const [showSuggestion,setShowSuggestion]=useState<boolean>(false);
    const [activeSuggestion,setActiveSuggestion]=useState<number>(0);
    const [userHistory,setUserHistory]=useState<string[]>([]);
    const users=localStorage.user;
    console.log(users);
    const renderSuggestions=()=>{
      if(showSuggestion && name){
          if(suggestions.length){
              return(
                  <ul className="suggestions">
                      {suggestions.map((item,index)=> {
                         let className;
                         console.log(index);
                         if(index===activeSuggestion)
                         {
                          className="suggestion-active";
                         }
                         return(
                          <li key={index} className={className}  onClick={()=>setName(item)}>{item}</li>
                         );
                      })}
                  </ul>
              );
          }
          else{
              return(
                  <div className="no-suggestions">
                      <em>No Suggestions</em>
                  </div>
              );
          }
      }
      
  }
    
   const onKeyDown=(e: React.KeyboardEvent<HTMLInputElement>):void=>{

      if(e.key==="13")
      {
          setName("");
          setShowSuggestion(false);
          setActiveSuggestion(0);
          return;
      }
      else if(e.key==="38"){
          if(activeSuggestion===0){
              return;
          }
         setActiveSuggestion(activeSuggestion-1);
      }
      else if(e.key==="40"){
          if(activeSuggestion-1===suggestions.length){
              return;
          }
         setActiveSuggestion(activeSuggestion+1);
      }
     }
    
   const handleChange=(e: React.FormEvent<HTMLInputElement>): void=>{
        let filteredList: string[];
        setName(e.currentTarget.value);
        if(name === "")
        {
            filteredList=[];
        }
        else{
          const history = JSON.parse(localStorage.user);
            filteredList=history.filter((item: any)=>{
                return item.toLowerCase().includes(name.toLowerCase());
            })
            console.log(filteredList);
        
        setSuggestions(filteredList);
        
        setShowSuggestion(true);
       
          }   
    }
    const handleSubmit=(e: React.FormEvent<HTMLFormElement>): void=>{
       e.preventDefault();
       userHistory.push(name);
       setUserHistory(userHistory);
       localStorage.setItem('user',JSON.stringify(userHistory))
       axios.get<Mydata[]>(`https://api.github.com/users/${name}/events`,{
        headers:{
            "Content-Type":"application/json"
        }
       }).then(response=>{
        console.log(response);
        setData(response.data);
       })
       axios.get<userEvents>(`https://api.github.com/users/${name}`,{
        headers:{
            "Content-Type":"application/json"
        }
       }).then(response=>{
        console.log(response);
      setEvent(response.data);
       })

    }
    
    return(
      
        <div className="body-section">
           <form className="search-form" onSubmit={handleSubmit}>
           <Input type='search' value={name} placeholder='Enter Username'  onChange={handleChange} onKeyDown={onKeyDown} ></Input>
           <Button type='submit'></Button>
           </form>
           <div>{renderSuggestions()}</div>
        <div className="activity-section">
           <div className="activity-section-header">
              <a href={event?.html_url} target="_blank">
                <img src={event?.avatar_url} className="avatar" alt="profile"></img>
              </a>
              <br></br>
              <span>Most Recent Activity of
                <a className="user-link" href={event?.html_url} target="_blank">&nbsp;{event?.login}</a>
              </span>
              <br></br>
              <div className="grid flex center">
                 <div className="grid-item flex center">
                  <span>
                    <a href={`https://github.com/${event?.login}?tab=repositories`} target='_blank' className="user-data-link">Repos</a>
                   :{event?.public_repos}
                  </span>
                 </div>

                 <div className="grid-item flex center">
                  <span>
                    <a href={`https://gist.github.com/${event?.login}`} target='_blank' className="user-data-link">Gists</a>
                    :{event?.public_gists}
                  </span>
                 </div>

                 <div className="grid-item flex center">
                  <span>
                    <a href={`https://github.com/${event?.login}?tab=followers`} target='_blank' className="user-data-link">Followers</a>
                    :{event?.followers}
                  </span>
                 </div>

                 <div className="grid-item flex center">
                  <span>
                    <a href={`https://github.com/${event?.login}?tab=following`} target='_blank' className="user-data-link">Following</a>
                    :{event?.following}
                  </span>
                 </div>
              </div>
           </div>
           <div className="activity-section-body flex center"> 
          {
            data?.map(item=>{
               return(
                <div className="activity-section-item" key={item.id}>
                     {(()=>{
                        switch(item.type)
                        {
                           case 'PushEvent':
                              return(
                                <div className="activity-item-default">
                                <div className="activity-item-header">
                                 <div className="item-type">{item.type}</div>
                                 <p className="time">{item.created_at.split('T')[0]}</p>
                                 <div className="item-repo">
                                 <a href={`https://github.com/${item.repo.name}`} target="_blank" className="item-repo-link">
                                    {`${item.repo.name}`}
                                 </a>
                                 </div>
                                 <div className="item-commit">
                                    Related Commits
                                    <div className="item-commit-item">
                                      <div className="item-commit-item-message">
                                        {item.payload.size}
                                        ➡️ 
                                      <a href={`https://github.com/${item.repo.name}/commit/${item.payload.commits[0]?.sha}`} target="_blank" >
                                        {`${item.payload.commits[0]?.message}`}
                                      </a>
                                      </div>
                                    </div>
                
                                 </div>
                                </div>
                              </div>
                               )
                               case 'CreateEvent':
                                return(
                                  <div className="activity-item-create-event">
                                  <div className="activity-item-header">
                                   <div className="item-type">{item.type}</div>
                                   <p className="time">{item.created_at.split('T')[0]}</p>
                                   <div className="item-repo">
                                   <a href={`https://github.com/${item.repo.name}`} target="_blank" className="item-repo-link">
                                      {`${item.repo.name}`}
                                   </a>
                                   </div>
                                  </div>
                                </div>
                                 ) 
                                 case 'DeleteEvent':
                                return(
                                  <div className="activity-item-delete-event">
                                  <div className="activity-item-header">
                                   <div className="item-type">{item.type}</div>
                                   <p className="time">{item.created_at.split('T')[0]}</p>
                                   <div className="item-repo">
                                   <a href={`https://github.com/${item.repo.name}`} target="_blank" className="item-repo-link">
                                      {`${item.repo.name}`}
                                   </a>
                                   </div>
                                  </div>
                                </div>
                                 ) 
                                 case 'MemberEvent':
                                    return(
                                      <div className="activity-item-default">
                                      <div className="activity-item-header">
                                       <div className="item-type">{item.type}</div>
                                       <p className="time">{item.created_at.split('T')[0]}</p>
                                       <div className="item-repo">
                                       <a href={`https://github.com/${item.repo.name}`} target="_blank" className="item-repo-link">
                                          {`${item.repo.name}`}
                                       </a>
                                       </div>
                                      </div>
                                    </div>
                                     )    
                                     case 'PullRequestEvent':
                                        return(
                                          <div className="activity-item-pull-request-event">
                                          <div className="activity-item-header">
                                           <div className="item-type">{item.type}</div>
                                           <p className="time">{item.created_at.split('T')[0]}</p>
                                           <div className="item-repo">
                                           <a href={`https://github.com/${item.repo.name}`} target="_blank" className="item-repo-link">
                                              {`${item.repo.name}`}
                                           </a>
                                           </div>
                                           <div className="item-commit">
                                              Related Commits
                                              <div className="item-pull-request">
                                                <div className="item-pull-request-message">
                                                <a href={`https://github.com/${item.repo.name}/pull/1`} target="_blank" >
                                                  Watch Pull Request
                                                </a>
                                                &nbsp;&nbsp;
                                                <a href={`https://github.com/${item.repo.name}/pull/1/files`} target="_blank" >
                                                  Watch Code Differnce
                                                </a>
                                                </div>
                                              </div>
                          
                                           </div>
                                          </div>
                                        </div>
                                         )
                              default: { 
                               console.log("Invalid choice"); 
                               break;              
                            } 
                       }
           
                     })()} 
                        
                
               
               
            
            </div>
               )
            })
          }
            

           </div>
        </div>
        </div>
        
    )
}

export default SearchBox;