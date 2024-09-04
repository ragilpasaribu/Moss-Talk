/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import Avatar from "./Avatar"


const UserSearchCard = ({user,onClose}) => {
  return (
    <Link to={"/" + user.id} onClick={onClose} className="flex items-center gap-4 p-2 border border-transparent border-b-slate-200 lg:p-4 hover:border hover:border-primary rounded cursor-pointer">
        <div>
            <Avatar width={50} height={50} name={user?.name} userId={user?.id} imageUrl={user?.profile_pic}/>
        </div>

        <div>
            <div className="font-semibold font-mono text-ellipsis line-clamp-1">
                {user?.name}
            </div>
            <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
        </div>
    </Link>
  )
}

export default UserSearchCard