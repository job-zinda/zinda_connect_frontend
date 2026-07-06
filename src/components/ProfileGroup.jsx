// import React from "react";

// export default function ProfileGroup({
// title,
// data
// }) {

// return(

// <div className="profile-group">

// <div className="section-head">
// <h3>{title}</h3>
// <a href="#">View All →</a>
// </div>

// <div className="cards-grid">

// {data.map((item,index)=>(

// <div
// className="profile-card"
// key={index}
// >

// <div className="image-wrap">

// <img
// src={item.img}
// alt=""
// />

// </div>

// <div className="card-body">

// <h4>
// {item.name},
// {item.age}
// </h4>

// <p>{item.religion}</p>

// <small>
// 💼 {item.job}
// </small>

// <small>
// 🎓 {item.edu}
// </small>

// <small>
// 📍 {item.place}
// </small>

// <button>
// Connect
// </button>

// </div>

// </div>

// ))}

// </div>

// </div>

// )

// }


import React from "react";

export default function ProfileGroup({ title, data, onViewProfile }) {
  return (
    <div className="profile-group">
      <div className="section-head">
        <h3>{title}</h3>
        <a href="#">View All →</a>
      </div>

      <div className="cards-grid">
        {data.map((item, index) => (
          <div className="profile-card" key={index}>
            <div className="image-wrap">
              <img src={item.img} alt={item.name} />
            </div>

            <div className="card-body">
              <h4>
                {item.name}, {item.age}
              </h4>

              <p>{item.religion}</p>

              <small> {item.job}</small>
              <small> {item.edu}</small>
              <small> {item.place}</small>

              <button onClick={() => onViewProfile(item)}>
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}