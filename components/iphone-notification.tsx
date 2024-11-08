import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NotificationProps {
    title: string
    description: string
    image?: string
    darkMode?: boolean
}

export default function Component({ notification }: { notification: NotificationProps }) {
    const { title, description, image, darkMode = false } = notification

    return (
        <div className={`flex items-center justify-center min-h-screen p-4 select-none`}>
            <div className={`w-[380px] h-[755px] ${darkMode ? 'bg-zinc-800' : 'bg-black'} rounded-[63px] overflow-hidden shadow-xl relative border-4 ${darkMode ? 'border-zinc-900' : 'border-zinc-700'}`}>
                {/* iPhone frame */}
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-xl`}></div>

                {/* Screen */}
                <div className={`w-full h-full ${darkMode ? 'bg-zinc-900' : 'bg-white'} pt-5 pb-0 px-3 flex flex-col`}>
                    {/* Status bar */}
                    <div className="flex justify-between items-center mb-4 mx-4">
                        <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>9:41</span>
                        <div className="flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-black'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                        </div>
                    </div>

                    {/* Notification */}
                    <Card className={`w-full mb-3 ${darkMode ? 'bg-zinc-900' : 'bg-white'} ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={image} alt="App Icon" />
                                    <AvatarFallback>K</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-black'}`}>{title}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Placeholder content */}
                    <div className={`flex-1 ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-xl rounded-b-[0px]`}></div>

                    {/* Bottom bar */}
                    <div className={`flex flex-col justify-between items-center h-12 w-[380px] absolute bottom-0 left-0 ${darkMode ? 'bg-black' : 'bg-zinc-300'}`}>
                        <div
                            className={`mx-auto ${darkMode ? 'text-white' : 'text-zinc-900'} text-xs mt-3`}
                        >Kowroo</div>
                        {/* Home indicator */}
                        <div className={`w-32 h-1 ${darkMode ? 'bg-zinc-100' : 'bg-black'} rounded-full mx-auto mb-2`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}