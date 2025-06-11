import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Skeleton} from "antd";

function Hero({title}) {

    const {user, isAuthenticated} = useAuth0()

    return (
        <section className="py-16 md:py-8 min-h-[150px]">
            <div className="flex px-14 w-full h-full items-center justify-between">
                {isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center gap-5">
                        <img src={user.picture} className='rounded-full size-20' alt='user avatar'/>
                        <p>Xin chào, <strong>{user.name}</strong></p>
                    </div>
                ) : <div className="w-[20%]"><Skeleton active/></div>}
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    {title}
                </p>
            </div>
        </section>
    )
}

export default Hero