import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";


function Navbar(){

const { user, roleHome } = useAuth();

return (

<nav className="
w-full
px-8
py-5
flex
justify-between
items-center
bg-white
border-b
">

<div>
<Logo/>
</div>


<div className="flex gap-6 items-center">

{user ? (

<Link
to={roleHome[user.role] || "/"}
className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
hover:bg-blue-700
"
>
Go to Dashboard
</Link>

) : (
<>

<Link
to="/login"
className="text-slate-600 hover:text-blue-600"
>
Login
</Link>


<Link
to="/register"
className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
hover:bg-blue-700
"
>
Get Started
</Link>

</>
)}


</div>


</nav>

);

}

export default Navbar;