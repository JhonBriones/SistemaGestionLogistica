import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useState } from 'react';
import ChatFloating from '../modal/ChatFloating';

export const Views = () => {

    const [showSidebar, setShowSidebar] = useState(true)

    return (
        <div className="flex w-full h-screen overflow-hidden">
            
            <Sidebar  showSidebar={showSidebar}/>

            <div className="flex flex-col overflow-auto h-full w-full">
                <Header setShowSidebar={setShowSidebar} />

                <main className="flex-1 overflow-auto">
                    <Outlet/>
                    <ChatFloating /> 
                </main>

            </div>
        </div>
    )
}
export default Views