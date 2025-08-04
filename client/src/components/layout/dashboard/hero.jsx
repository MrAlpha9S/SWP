import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Skeleton} from "antd";

function Hero({title, role, username}) {

    const {user, isAuthenticated} = useAuth0()

    return (
        <section  className=" z-10 py-16 md:py-8 min-h-[50px] w-full bg-primary-100 flex flex-col items-center">
            <div className="flex px-14 w-[1680px] h-full items-center justify-between">
                {isAuthenticated ? (
                    <div  className=" flex flex-col hidden md:flex items-center justify-center gap-5">
                        <img src={user.picture} className='rounded-full h-[80px] w-[80px] max-h-20 max-w-20' alt='user avatar'/>
                        <p>Xin chào, <strong>{username}</strong> ({role})</p>

                    </div>
                ) : <div className="w-[20%]"><Skeleton active/></div>}

                <p className="text-xl md:text-2xl lg:text-5xl font-bold text-gray-900">
                    {title}
                </p>
            </div>
        </section>
    )
}

export default Hero