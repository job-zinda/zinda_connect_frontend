import React from "react";

export default function Feature({
icon,
title,
text
}){

return(

<div className="feature-card">

<div>{icon}</div>

<h4>{title}</h4>

<p>{text}</p>

</div>

)

}