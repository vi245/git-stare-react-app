import { useState } from "react";
import * as React from "react";
import './styles/home.css'
import Input from './Input';
import Button from "./Button";
import axios from 'axios';

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
  interface Suggestion{
    suggestion:string;
  }
  

const SearchBox: React.FC=()=>{
    const [name,setName]=useState<string>('');
    const [data,setData]=useState<Mydata[]>([]);
    const [event,setEvent]=useState<userEvents>();
    const [suggestions,setSuggestions]=useState<Suggestion[]>([]);
    const [showSuggestion,setShowSuggestion]=useState<boolean>(false);
    const [activeSuggestion,setActiveSuggestion]=useState<number>(0);
    const [userHistory,setUserHistory]=useState<string[]>([]);

   const handleChange=(e: React.FormEvent<HTMLInputElement>): void=>{
        setName(e.currentTarget.value);
    }
    const handleSubmit=(e: React.FormEvent<HTMLFormElement>): void=>{
       e.preventDefault();
     userHistory.push(name);
        setUserHistory(userHistory);
        console.log(userHistory);
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
           <Input type='search' value={name} placeholder='Enter Username' onChange={handleChange}  ></Input>
           <Button type='submit'></Button>
        </form>
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