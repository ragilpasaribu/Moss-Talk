/* eslint-disable react/prop-types */
import talking from "../assets/talking.png"

const AuthLayout = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-24 shadow-md bg-white'>
            <img
                src={talking}
                alt='logo'
                width={100}
                height={60} 
            />
        </header>
        {children}
    </>
  )
}

export default AuthLayout;