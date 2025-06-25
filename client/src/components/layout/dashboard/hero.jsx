import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Skeleton} from "antd";

function Hero({title, heroHeight = 188, role}) {

    const {user, isAuthenticated} = useAuth0()

    return (
        <section style={{height : heroHeight, transition: 'height 0.2s'}} className="sticky top-[80px] z-50 py-16 md:py-8 min-h-[50px] w-full bg-primary-100 flex flex-col items-center">
            <div className="flex px-14 w-[1680px] h-full items-center justify-between">
                {isAuthenticated ? (
                    <div style={{flexDirection: heroHeight === 188 ? "column" : "row"}} className="hidden md:flex items-center justify-center gap-5">
                        <img style={heroHeight === 188 ? {height:80, width: 80} : {height:30, width:30}} src={user.picture} className='rounded-full max-h-20 max-w-20' alt='user avatar'/>
                        <p>Xin chào, <strong>{user.name}</strong> ({role})</p>
                        
                    </div>
                ) : <div className="w-[20%]"><Skeleton active/></div>}
                <p style={heroHeight === 188 ? {} : {fontSize : 30}} className="text-xl md:text-2xl lg:text-5xl font-bold text-gray-900">
                    {title}
                </p>
            </div>
        </section>
    )
}

export default Hero