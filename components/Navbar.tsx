import React from 'react'
import {Box} from "lucide-react";
import Button from "./UI/Button";
import {useOutletContext} from "react-router";

const Navbar = () => {

   const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()

    const handleAuthclick = async () => {
       if(isSignedIn) {
           try {
               await signOut();
           } catch (e) {
               console.error("Puter Sign Out Faild.", e);
           }
           return;
       }
       
       try {
           await signIn();
       }catch (e) {
           console.error("Puter Sign In Faild", e);
       }
    };

    // @ts-ignore
    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo"/>

                        <span className="name">
                            Roomfiy
                        </span>
                    </div>

                    <ul className="links">
                        <a href="#">Product</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                        <a href="#">Enterprise</a>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                               {userName ? `Hi, ${userName}` : 'Sign In'}
                            </span>
                            <Button size="sm" onClick={handleAuthclick} className="btn">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button className="login" onClick={handleAuthclick} size="sm" variant="primary">
                                Log In
                            </Button>
                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}



                </div>
            </nav>
        </header>
    )
}

export default Navbar;