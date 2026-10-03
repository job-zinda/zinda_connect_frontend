import React from "react";

export default function DeleteAccount() {
  return (
    <div style={{maxWidth:"800px", margin:"40px auto", padding:"20px", fontFamily:"sans-serif"}}>
      <h1>Delete Account - ZindaConnect</h1>
      <p>How to delete your account:</p>
      <ol>
        <li>Open ZindaConnect App / Website</li>
        <li>Login → Settings → Account Preferences</li>
        <li>Click "Delete Account" button</li>
        <li>Confirm twice → Account deleted permanently</li>
      </ol>
      <p><b>API:</b> DELETE https://api.zindaconnect.com/api/auth/account/delete/</p>
      <p><b>Email deletion:</b> Email to support@zindaconnect.com with registered email</p>
      <p><b>Data deleted:</b> Profile, Chats, Messages, Likes, Favourites, Account - all permanent</p>
      <p><b>Deletion Time:</b> Immediate (in-app) or within 7 days (email request)</p>
    </div>
  );
}