import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrump.css'
const Breadcrumb = ({idName}) => {
  const {pathname} = useLocation()
  const unWantedPaths =['book-details']
  const pathnames = pathname.split('/').filter((x)=> x && !unWantedPaths.includes(x))

  console.log(pathnames)
  let breadcrumpPath=''
  return (
    <section className="breadcrumb flex container ">
       <Link to={'/'}>Home</Link>
       {pathnames.map((name,index)=>{
        breadcrumpPath += `/${name}`
        const isLast = index ===pathnames.length-1
        return isLast ?(
          
          <span key={breadcrumpPath} className="breadcrumb__link">/ {idName ? idName : name}</span>
        ): (
          <span key={breadcrumpPath}>
            / <Link to={breadcrumpPath} className="breadcrumb__link">{name}</Link>
          </span>
        )
       })}
     
      
    </section>
  );
};

export default Breadcrumb;
