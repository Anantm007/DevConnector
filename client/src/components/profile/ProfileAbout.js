import React, {Fragment} from 'react';

const ProfileAbout = ({profile: {
    bio,
    user: {name},
    skills,

}}) => 
        <div class="profile-about bg-light p-2">
            { bio && (
                <Fragment>
                    
          <h2 class="text-primary">{name.trim().split(' ')[0] + "'s"} Bio</h2>
          <p>
              {bio}
          </p>
                </Fragment>
            )}
          <div class="line"></div>
          <h2 class="text-primary">Skill Set</h2>
          <div class="skills">
              {
                  skills.map((skill, index) => (
                    <div key={index} className="p-1">
                        <i className="fas fa-check"/>{skill}
                    </div>    
                  ))
              }
          </div>
        </div>;


export default ProfileAbout
